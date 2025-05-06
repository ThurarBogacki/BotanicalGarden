// app/api/plantas/[id]/route.js

export async function GET(request, { params }) {
    const { id } = params;
  
    try {
      const response = await fetch(`https://elc133-production.up.railway.app/plantas/${id}`);
  
      if (!response.ok) {
        return new Response('Falha ao obter dados', { status: response.status });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response('Erro no servidor', { status: 500 });
    }
  }
  
  export async function DELETE(request, { params }) {
    const { id } = params;
  
    try {
      const response = await fetch(`https://elc133-production.up.railway.app/plantas/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        return new Response('Falha ao deletar dado', { status: response.status });
      }
  
      return new Response('Dado deletado com sucesso', { status: 200 });
    } catch (error) {
      return new Response('Erro ao deletar dado', { status: 500 });
    }
  }
  