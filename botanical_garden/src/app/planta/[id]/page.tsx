'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';

type Planta = {
  _id: string;
  nomePopular: string;
  nomeCientifico: string;
  descricao: string;
  cuidados: string;
  imagemUrl: string;
  alturaMaxima?: string;
  corDaFlor?: string;
  origem?: string;
  tipoDeFolha?: string;
};

export default function PlantaPage() {
  const params = useParams();
  const [planta, setPlanta] = useState<Planta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  
  const handleDelete = async (id: string) => {
    const username = prompt("Digite o nome de usuário do admin:");
    const password = prompt("Digite a senha do admin:");
  
    if (!username || !password) {
      alert("Você precisa inserir o nome de usuário e a senha.");
      return;
    }
  
    try {
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), 
      });
  
      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        alert(errorData.message || 'Falha na autenticação!');
        return;
      }
  
      const deleteResponse = await fetch(`/api/plantas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), 
      });
  
      if (!deleteResponse.ok) {
        throw new Error('Erro ao deletar a planta');
      }
  
      alert('Planta deletada com sucesso!');

      router.push('/');  
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao tentar realizar a operação!');
    }
  };
  
  
  

  useEffect(() => {
    if (!params.id) {
      setError("ID da planta não encontrado.");
      setLoading(false);
      return;
    }

    const fetchPlanta = async () => {
      try {
        const res = await fetch(`/api/plantas/${params.id}`);
        if (!res.ok) {
          throw new Error('Planta não encontrada.');
        }
        const data = await res.json();
        setPlanta(data);
      } catch (error) {
        setError("Erro ao carregar os dados da planta.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanta();
  }, [params.id]);

  const gerarQRCodePDF = async () => {
    const url = `${window.location.origin}/planta/${params.id}`;
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        color: {
          dark: "#0f766e", 
          light: "#FFFFFF" 
        },
        margin: 2,
        scale: 8
      });
  
      const pdf = new jsPDF();
  
      const pageWidth = pdf.internal.pageSize.getWidth();
  

      pdf.setFontSize(20);
      pdf.setTextColor(15, 118, 110); 
      const titulo = `Planta: ${planta?.nomePopular}`;
      const tituloWidth = pdf.getTextWidth(titulo);
      pdf.text(titulo, (pageWidth - tituloWidth) / 2, 20);
  

      pdf.setFontSize(13);
      pdf.setTextColor(0, 0, 0);
      const subtitulo = "Acesse mais informações sobre esta planta:";
      const subtituloWidth = pdf.getTextWidth(subtitulo);
      pdf.text(subtitulo, (pageWidth - subtituloWidth) / 2, 35);

      pdf.setTextColor(0, 0, 255);
      const linkWidth = pdf.getTextWidth(url);
      const linkX = (pageWidth - linkWidth) / 2;
      pdf.textWithLink(url, linkX, 45, { url });
  

      const qrSize = 100;
      const centerX = (pageWidth - qrSize) / 2;
      pdf.addImage(qrDataUrl, 'PNG', centerX, 60, qrSize, qrSize);
  
      pdf.save(`QRCode-${planta?.nomePopular}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
    }
  };
  

  if (loading) {
    return <p className="p-6">Carregando...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!planta) {
    return <p className="p-6 text-red-500">Planta não encontrada.</p>;
  }

  return (
    <main className="p-6 md:p-10 max-w-4xl mx-auto bg-white shadow-lg rounded-3xl mt-10">
      <img
        src={planta.imagemUrl}
        alt={planta.nomePopular}
        className="w-full h-72 object-cover rounded-xl mb-6 shadow-sm"
        onError={(e) => (e.currentTarget.src = '/placeholder.png')}
      />
      <h1 className="text-4xl font-bold text-green-800 mb-2">{planta.nomePopular}</h1>
      <p className="text-xl italic text-gray-600 mb-6">{planta.nomeCientifico}</p>
      <p className="text-md text-gray-800 leading-relaxed mb-4">{planta.descricao}</p>

      <div className="space-y-2 text-gray-700">
        <p><strong className="text-green-900">🌿 Cuidados:</strong> {planta.cuidados}</p>
        {planta.alturaMaxima && <p><strong className="text-green-900">📏 Altura Máxima:</strong> {planta.alturaMaxima}</p>}
        {planta.corDaFlor && <p><strong className="text-green-900">🌸 Cor da Flor:</strong> {planta.corDaFlor}</p>}
        {planta.origem && <p><strong className="text-green-900">🌍 Origem:</strong> {planta.origem}</p>}
        {planta.tipoDeFolha && <p><strong className="text-green-900">🍃 Tipo de Folha:</strong> {planta.tipoDeFolha}</p>}
      </div>

      <button
        onClick={gerarQRCodePDF}
        className="mt-8 cursor-pointer bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-3 rounded-xl shadow-md transition duration-300"
      >
        📄 Gerar QR Code em PDF
      </button>
      <button
        onClick={() => handleDelete(planta._id)}
        className="mt-4 cursor-pointer ml-[10px] bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition duration-300"
      >
        🗑️ Deletar Planta
      </button>

    </main>
  );
}
