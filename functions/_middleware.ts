/**
 * Cloudflare Pages middleware — per-request CSP nonce injection.
 *
 * For every HTML response:
 *  1. Generates a cryptographically-random nonce.
 *  2. Uses HTMLRewriter to stamp `nonce="…"` onto every <script> element.
 *  3. Sets security headers (CSP, COOP, etc.) on the response.
 *
 * The nonce + 'strict-dynamic' combination removes the need for
 * 'unsafe-inline' in modern browsers while keeping host-allowlist
 * fallbacks for legacy ones.
 */

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function buildCsp(nonce: string): string {
  const directives: string[] = [
    "default-src 'self'",

    // 'strict-dynamic'  → trusted scripts may load further scripts dynamically
    // 'nonce-…'         → elements stamped with this nonce are trusted
    // 'unsafe-inline'   → ignored by strict-dynamic-aware browsers; fallback only for very old ones
    // host allowlist    → ignored by strict-dynamic-aware browsers; fallback for older ones
    `script-src 'strict-dynamic' 'nonce-${nonce}' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com https://ajax.cloudflare.com`,

    // Inline styles required by Angular's runtime CSS injection
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

    // Trusted Types — instructs the browser to block DOM XSS sinks.
    // Angular 14+ has built-in Trusted Types support.
    // Note: verify that all third-party scripts (e.g. GTM) are Trusted-Types-compliant
    // before enforcing in production. Switch to `trusted-types` (report-only) first if unsure.
    "require-trusted-types-for 'script'",
  ];

  return directives.join("; ");
}

class ScriptNonceInjector implements HTMLRewriterElementContentHandlers {
  constructor(private readonly nonce: string) {}

  element(el: Element): void {
    el.setAttribute("nonce", this.nonce);
  }
}

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const nonce = generateNonce();

  const transformedResponse = new HTMLRewriter()
    .on("script", new ScriptNonceInjector(nonce))
    .transform(response);

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
