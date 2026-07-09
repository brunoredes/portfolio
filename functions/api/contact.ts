interface Env {
  DISCORD_WEBHOOK_URL: string;
  TURNSTILE_SECRET?: string;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };
const trunc = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1)}…` : value);
// Escape Discord markdown so submitted text can't render formatting or masked
// links (e.g. `[trusted](https://evil)`) in the channel.
const escapeMarkdown = (value: string) => value.replace(/([\\`*_~|>[\]()])/g, '\\$1');

// Cloudflare Turnstile server-side verification.
async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  if (!token) return false;
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const webhookUrl = context.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: 'Webhook not configured' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  // Reject anything that isn't a small JSON body before reading it.
  if (!(context.request.headers.get('content-type') ?? '').includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Unsupported content type' }), { status: 415, headers: JSON_HEADERS });
  }
  if (Number(context.request.headers.get('content-length') ?? '0') > 8192) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), { status: 413, headers: JSON_HEADERS });
  }

  let body: { nome?: string; assunto?: string; mensagem?: string; token?: string };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const nome = body.nome?.trim() ?? '';
  const assunto = body.assunto?.trim() ?? '';
  const mensagem = body.mensagem?.trim() ?? '';

  if (!nome || !assunto || mensagem.length < 10) {
    return new Response(JSON.stringify({ error: 'Invalid fields' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  // Anti-abuse: verify the Turnstile token when a secret is configured
  // (no-op in dev / until keys are set).
  const secret = context.env.TURNSTILE_SECRET;
  if (secret) {
    const token = typeof body.token === 'string' ? body.token : '';
    const ok = await verifyTurnstile(secret, token, context.request.headers.get('CF-Connecting-IP'));
    if (!ok) {
      return new Response(JSON.stringify({ error: 'Verification failed' }), { status: 403, headers: JSON_HEADERS });
    }
  }

  const payload = {
    embeds: [
      {
        title: trunc(`📬 Novo contato — ${assunto}`, 256),
        color: 0x5b45e0,
        fields: [
          { name: 'Nome', value: trunc(escapeMarkdown(nome), 1024) },
          { name: 'Mensagem', value: trunc(escapeMarkdown(mensagem), 1024) },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Webhook failed' }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }

  return new Response(null, { status: 204 });
};
