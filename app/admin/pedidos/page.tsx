'use client';

import { useEffect, useState } from 'react';
import { Package, Send, Copy, Check, X, Search, Filter, ShieldAlert } from 'lucide-react';

interface Pedido {
  id: number;
  transaction_id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  items: any[];
  total: number;
  status: string;
  enviado: boolean;
  codigo_rastreio: string | null;
  data_envio: string | null;
  created_at: string;
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [codigoRastreio, setCodigoRastreio] = useState('');
  const [urlRastreio, setUrlRastreio] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [copiedColumn, setCopiedColumn] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [clientIp, setClientIp] = useState('');

  useEffect(() => {
    verificarAcesso();
  }, []);

  const verificarAcesso = async () => {
    try {
      const response = await fetch('/api/admin/check-access');
      const data = await response.json();

      if (!data.allowed) {
        setAccessDenied(true);
        setClientIp(data.clientIp);
        setLoading(false);
      } else {
        carregarPedidos();
      }
    } catch (error) {
      setAccessDenied(true);
      setLoading(false);
    }
  };

  const carregarPedidos = async () => {
    try {
      const response = await fetch('/api/pedidos/listar');
      const data = await response.json();
      
      if (data.success) {
        setPedidos(data.pedidos);
      }
    } catch (error) {
      alert('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pedidosFiltrados.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pedidosFiltrados.map(p => p.id));
    }
  };

  const marcarComoEnviado = async () => {
    if (selectedIds.length === 0) {
      alert('Selecione pelo menos um pedido');
      return;
    }

    try {
      const response = await fetch('/api/pedidos/marcar-enviado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedidoIds: selectedIds,
          codigoRastreio: codigoRastreio || null,
          urlRastreio: urlRastreio || null
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setSelectedIds([]);
        setCodigoRastreio('');
        setUrlRastreio('');
        carregarPedidos();
      } else {
        alert('Erro: ' + data.error);
      }
    } catch (error) {
      alert('Erro ao marcar como enviado');
    }
  };

  const copiarColuna = (coluna: keyof Pedido) => {
    const valores = pedidosFiltrados
      .map(p => {
        const valor = p[coluna];
        if (coluna === 'endereco') {
          return `${p.endereco}, ${p.numero}${p.complemento ? ' - ' + p.complemento : ''} - ${p.bairro}, ${p.cidade}/${p.estado} - CEP: ${p.cep}`;
        }
        return valor;
      })
      .filter(v => v)
      .join('\n');

    navigator.clipboard.writeText(valores).then(() => {
      setCopiedColumn(coluna);
      setTimeout(() => setCopiedColumn(null), 2000);
    });
  };

  const pedidosFiltrados = pedidos.filter(p => {
    // Filtro por status
    if (filtro === 'enviados' && !p.enviado) return false;
    if (filtro === 'pendentes' && p.enviado) return false;
    if (filtro === 'pagos' && p.status !== 'PAID') return false;

    // Busca
    if (busca) {
      const searchLower = busca.toLowerCase();
      return (
        p.nome.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower) ||
        p.transaction_id.toLowerCase().includes(searchLower) ||
        p.telefone.includes(busca)
      );
    }

    return true;
  });

  if (accessDenied) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md text-center">
            <ShieldAlert className="mx-auto text-red-600 mb-4" size={64} />
            <h1 className="text-2xl font-bold text-red-800 mb-2">Acesso Negado</h1>
            <p className="text-red-700 mb-4">
              Seu IP não está autorizado a acessar esta área administrativa.
            </p>
            <div className="bg-red-100 rounded p-3 mb-4">
              <p className="text-sm text-red-800 font-mono">
                Seu IP: <strong>{clientIp}</strong>
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Para obter acesso, adicione seu IP à variável de ambiente{' '}
              <code className="bg-gray-200 px-2 py-1 rounded">ADMIN_IP_WHITELIST</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Carregando pedidos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciar Pedidos</h1>
        <p className="text-gray-600">Total de {pedidos.length} pedidos</p>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search size={16} className="inline mr-2" />
              Buscar
            </label>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome, email, telefone ou ID da transação"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter size={16} className="inline mr-2" />
              Filtrar por Status
            </label>
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="todos">Todos os Pedidos</option>
              <option value="pagos">Pagos</option>
              <option value="pendentes">Não Enviados</option>
              <option value="enviados">Enviados</option>
            </select>
          </div>
        </div>

        {/* Botões para Copiar Colunas */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Copiar Dados em Lote:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copiarColuna('email')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {copiedColumn === 'email' ? <Check size={16} /> : <Copy size={16} />}
              Todos os Emails
            </button>
            <button
              onClick={() => copiarColuna('telefone')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              {copiedColumn === 'telefone' ? <Check size={16} /> : <Copy size={16} />}
              Todos os Telefones
            </button>
            <button
              onClick={() => copiarColuna('endereco')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {copiedColumn === 'endereco' ? <Check size={16} /> : <Copy size={16} />}
              Todos os Endereços
            </button>
            <button
              onClick={() => copiarColuna('nome')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              {copiedColumn === 'nome' ? <Check size={16} /> : <Copy size={16} />}
              Todos os Nomes
            </button>
            <button
              onClick={() => copiarColuna('cpf')}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              {copiedColumn === 'cpf' ? <Check size={16} /> : <Copy size={16} />}
              Todos os CPFs
            </button>
          </div>
        </div>
      </div>

      {/* Ações em Lote */}
      {selectedIds.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-800">
              {selectedIds.length} pedido(s) selecionado(s)
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-red-600 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={codigoRastreio}
                onChange={(e) => setCodigoRastreio(e.target.value)}
                placeholder="Código de Rastreio (obrigatório)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="url"
                value={urlRastreio}
                onChange={(e) => setUrlRastreio(e.target.value)}
                placeholder="URL de Rastreio (opcional) - Ex: https://rastreamento.correios.com.br"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={marcarComoEnviado}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors w-full md:w-auto"
            >
              <Send size={20} />
              Marcar como Enviado
            </button>
          </div>
        </div>
      )}

      {/* Tabela de Pedidos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === pedidosFiltrados.length && pedidosFiltrados.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} className={selectedIds.includes(pedido.id) ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(pedido.id)}
                      onChange={() => toggleSelection(pedido.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">#{pedido.id}</div>
                    <div className="text-xs text-gray-500">{pedido.transaction_id.slice(0, 8)}...</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{pedido.nome}</div>
                    <div className="text-xs text-gray-500">CPF: {pedido.cpf}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{pedido.email}</div>
                    <div className="text-xs text-gray-500">{pedido.telefone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {pedido.endereco}, {pedido.numero}
                    </div>
                    <div className="text-xs text-gray-500">
                      {pedido.bairro}, {pedido.cidade}/{pedido.estado}
                    </div>
                    <div className="text-xs text-gray-500">CEP: {pedido.cep}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      R$ {pedido.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {pedido.items.length} item(ns)
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        pedido.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        pedido.status === 'ENVIADO' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pedido.status}
                      </span>
                      {pedido.enviado && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Package size={12} />
                          Enviado
                        </span>
                      )}
                      {pedido.codigo_rastreio && (
                        <span className="text-xs text-gray-600">
                          {pedido.codigo_rastreio}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(pedido.created_at).toLocaleTimeString('pt-BR')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pedidosFiltrados.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum pedido encontrado
          </div>
        )}
      </div>
    </div>
  );
}
