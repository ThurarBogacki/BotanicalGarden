'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Planta = {
  _id: string;
  nomePopular: string;
};

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [senhaInput, setSenhaInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [plantas, setPlantas] = useState<Planta[]>([]);

  const [nomePopular, setNomePopular] = useState('');
  const [nomeCientifico, setNomeCientifico] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cuidados, setCuidados] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [alturaMaxima, setAlturaMaxima] = useState('');
  const [corDaFlor, setCorDaFlor] = useState('');
  const [origem, setOrigem] = useState('');
  const [tipoDeFolha, setTipoDeFolha] = useState('');

  const router = useRouter(); 

  const fetchPlantas = async () => {
    try {
      const res = await fetch('/api/plantas');
      if (res.ok) {
        const data = await res.json();
        setPlantas(data);
      }
    } catch (err) {
      console.error("Erro ao buscar plantas:", err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginResponse = await fetch('api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameInput, password: senhaInput }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));
        alert(errorData.message || 'Falha na autenticação!');
        router.push("/")
        return;
      }

      setAutenticado(true);
      fetchPlantas(); // carrega após autenticar
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao tentar fazer login!');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/plantas/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Erro ao deletar planta');
      }

      alert('Planta deletada com sucesso!');
      setPlantas((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar planta.");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!nomePopular.trim() || !descricao.trim()) {
      alert('Por favor, preencha pelo menos o nome popular e a descrição da planta.');
      return;
    }

    const newPlanta = {
      nomePopular,
      nomeCientifico,
      descricao,
      cuidados,
      imagemUrl,
      alturaMaxima,
      corDaFlor,
      origem,
      tipoDeFolha,
    };

    try {
      const res = await fetch('/api/plantas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlanta),
      });

      if (!res.ok) {
        alert('Erro ao cadastrar planta!');
        return;
      }

      alert('🌱 Planta cadastrada com sucesso!');
      setNomePopular('');
      setNomeCientifico('');
      setDescricao('');
      setCuidados('');
      setImagemUrl('');
      setAlturaMaxima('');
      setCorDaFlor('');
      setOrigem('');
      setTipoDeFolha('');
      fetchPlantas(); // atualiza a lista
    } catch (error) {
      alert('Erro ao enviar dados!');
      console.error(error);
    }
  };

  const handleVoltar = () => {
    router.push('/'); 
  };

  if (!autenticado) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-green-800 text-center">
            Acesso Administrativo
          </h2>
          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Digite o nome de usuário"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="border text-black p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              placeholder="Digite a senha"
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              className="border text-black p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-10 px-4 flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl mb-10">
        <button
          onClick={handleVoltar}
          className="text-sm cursor-pointer text-green-600 mb-4 flex items-center gap-2 hover:underline"
        >
          <span>←</span> Voltar para a Home
        </button>

        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center font-serif">
          🌱 Cadastro de Nova Planta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'Nome Popular*', value: nomePopular, setter: setNomePopular },
            { label: 'Nome Científico', value: nomeCientifico, setter: setNomeCientifico },
            { label: 'Descrição*', value: descricao, setter: setDescricao, type: 'textarea' },
            { label: 'Cuidados', value: cuidados, setter: setCuidados },
            { label: 'URL da Imagem', value: imagemUrl, setter: setImagemUrl },
            { label: 'Altura Máxima', value: alturaMaxima, setter: setAlturaMaxima },
            { label: 'Cor da Flor', value: corDaFlor, setter: setCorDaFlor },
            { label: 'Origem', value: origem, setter: setOrigem },
            { label: 'Tipo de Folha', value: tipoDeFolha, setter: setTipoDeFolha },
          ].map((field, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm font-medium text-green-800 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="border text-gray-600 p-2 rounded-md shadow-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="border text-black p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full cursor-pointer bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 font-medium transition shadow-md"
            >
              Cadastrar Planta
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
        <h3 className="text-2xl font-bold text-green-900 mb-4 text-center">🌿 Plantas Cadastradas</h3>
        {plantas.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma planta cadastrada.</p>
        ) : (
          <ul className="space-y-3">
            {plantas.map((planta) => (
              <li key={planta._id} className="flex justify-between items-center bg-green-50 px-4 py-2 rounded-md shadow-sm">
                <span className="text-green-900 font-medium">{planta.nomePopular}</span>
                <button
                  onClick={() => handleDelete(planta._id)}
                  className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Deletar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
