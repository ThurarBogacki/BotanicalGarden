export async function GET(request) {
  try {
    const response = await fetch('https://elc133-production.up.railway.app/plantas');

    if (!response.ok) {
      return new Response('Falha ao obter dados', { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response('Erro no servidor', { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch('https://elc133-production.up.railway.app/plantas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response('Erro ao cadastrar planta', { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response('Erro interno ao cadastrar planta', { status: 500 });
  }
}
