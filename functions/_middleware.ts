/**
 * Cloudflare Pages middleware — per-request CSP nonce injection.
 *
 * For every HTML response:
 *  1. Generates a cryptographically-random nonce.
 *  2. Uses HTMLRewriter to stamp `nonce="…"` onto every <script> element,
 *     including a manually-injected Cloudflare Insights beacon (see below).
 *  3. Sets security headers (CSP, COOP, etc.) on the response.
 *
 * WHY we inject the Cloudflare Insights beacon here instead of relying on
 * the automatic edge injection:
 *   Cloudflare's edge appends the beacon AFTER this middleware runs, so it
 *   never receives a nonce. With 'strict-dynamic' active the host allowlist
 *   is ignored, so the edge-injected beacon is blocked by CSP.
 *   We disable auto-injection (Cloudflare Dashboard → Web Analytics → "Manual")
 *   and emit the beacon ourselves so HTMLRewriter can nonce it.
 *
 * WHY 'require-trusted-types-for "script"' is omitted:
 *   Google Tag Manager uses innerHTML and is not Trusted Types compliant.
 *   Enforcing Trusted Types without a GTM-compatible policy breaks analytics.
 *   Use a Content-Security-Policy-Report-Only header to audit before enforcing.
 *
 * WHY inline event handlers from GTM are still blocked:
 *   When a nonce is present, 'unsafe-inline' is silently ignored for event
 *   handlers (onclick, onload, …). This is correct CSP behaviour. GTM tags
 *   that use inline event handlers must be migrated to use Custom HTML tags
 *   with addEventListener() inside GTM, or GTM's built-in trigger system.
 */

/** Cloudflare Web Analytics beacon token — set the real token here. */
const CF_BEACON_TOKEN = "";

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function buildCsp(nonce: string): string {
  const directives: string[] = [
    "default-src 'self'",

    // 'strict-dynamic'  → scripts created by trusted (nonced) scripts are allowed
    // 'nonce-…'         → elements stamped with this nonce are trusted
    // 'unsafe-inline'   → ignored when a nonce is present (modern browsers);
    //                     kept as fallback for browsers without nonce support
    // host allowlist    → ignored by strict-dynamic-aware browsers;
    //                     kept as fallback for older browsers
    `script-src 'strict-dynamic' 'nonce-${nonce}' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com https://ajax.cloudflare.com`,

    // Inline styles are required by Angular's runtime CSS injection
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

    "img-src 'self' data:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://cloudflareinsights.com",
    "worker-src 'self'",
    "manifest-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ];

  return directives.join("; ");
}

class ScriptNonceInjector implements HTMLRewriterElementContentHandlers {
  constructor(private readonly nonce: string) {}

  element(el: Element): void {
    el.setAttribute("nonce", this.nonce);
  }
}

/**
 * Appends the Cloudflare Web Analytics beacon to <body> with the current
 * nonce. Only runs when CF_BEACON_TOKEN is set.
 * This replaces the automatic edge injection so the script receives a nonce.
 */
class BeaconInjector implements HTMLRewriterElementContentHandlers {
  constructor(private readonly nonce: string) {}

  element(el: Element): void {
    if (!CF_BEACON_TOKEN) return;
    el.append(
      `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${CF_BEACON_TOKEN}"}' nonce="${this.nonce}"></script>`,
      { html: true },
    );
  }
}

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const nonce = generateNonce();

  const rewriter = new HTMLRewriter()
    .on("script", new ScriptNonceInjector(nonce));

  if (CF_BEACON_TOKEN) {
    rewriter.on("body", new BeaconInjector(nonce));
  }

  const transformedResponse = rewriter.transform(response);

  // Clone the headers so we can mutate them
  const headers = new Headers(transformedResponse.headers);
  headers.set("Content-Security-Policy", buildCsp(nonce));

  // Cross-Origin-Opener-Policy isolates the top-level browsing context
  // from cross-origin popups, mitigating cross-origin information leaks.
  headers.set("Cross-Origin-Opener-Policy", "same-origin");

  // HSTS: max-age=31536000 (1 year) with includeSubDomains + preload is the
  // recommended final value for preload-list eligibility. It is intentionally
  // kept at this value — do not lower it once the domain is on the preload list.
  headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  return new Response(transformedResponse.body, {
    status: transformedResponse.status,
    statusText: transformedResponse.statusText,
    headers,
  });
};
