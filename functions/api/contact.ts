interface Env {
  DISCORD_WEBHOOK_URL: string;
}

const trunc = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1)}…` : value);

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const webhookUrl = context.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: 'Webhook not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { nome?: string; assunto?: string; mensagem?: string };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const nome = body.nome?.trim() ?? '';
  const assunto = body.assunto?.trim() ?? '';
  const mensagem = body.mensagem?.trim() ?? '';

  if (!nome || !assunto || mensagem.length < 10) {
    return new Response(JSON.stringify({ error: 'Invalid fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = {
    embeds: [
      {
        title: trunc(`📬 Novo contato — ${assunto}`, 256),
        color: 0x5b45e0,
        fields: [
          { name: 'Nome', value: trunc(nome, 1024) },
          { name: 'Mensagem', value: trunc(mensagem, 1024) },
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
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(null, { status: 204 });
};
