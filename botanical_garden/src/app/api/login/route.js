// app/api/login/route.js

export async function POST(request) {
    try {
      const body = await request.json();
  
      const response = await fetch('https://elc133-production.up.railway.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        return new Response('Falha no login', { status: response.status });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response('Erro no servidor', { status: 500 });
    }
  }
  