export async function POST(request) {
    try {
      const body = await request.json();
      console.log("Corpo recebido no /api/login local:", body); 
  
      const response = await fetch('https://elc133-production.up.railway.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const responseText = await response.text();
      console.log("Resposta da API externa:", responseText); 
  
      if (!response.ok) {
        return new Response(responseText, { status: response.status });
      }
  
      return new Response(responseText, { status: 200 });
  
    } catch (error) {
      console.error('Erro no /api/login local:', error);
      return new Response('Erro no servidor', { status: 500 });
    }
  }
  