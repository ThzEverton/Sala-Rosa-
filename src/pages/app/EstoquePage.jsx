import { useState, useEffect } from 'react'
import { getProdutos } from '../../services/api.js'
import { formatarMoeda } from '../../utils/dateUtils.js'
import Badge from '../../components/ui/Badge.jsx'

export default function EstoquePage() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProdutos().then((p) => { setProdutos(p); setLoading(false) })
  }, [])

  if (loading) return <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>

  const estoqueBaixo = produtos.filter((p) => p.ativo && p.estoqueAtual <= p.estoqueMinimo)

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-charcoal-900 mb-6">Estoque</h2>

      {estoqueBaixo.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <h3 className="font-body font-semibold text-amber-800 mb-2">Produtos com estoque baixo</h3>
          <div className="flex flex-wrap gap-2">
            {estoqueBaixo.map((p) => (
              <Badge key={p.id} variant="warning">{p.nome}: {p.estoqueAtual}/{p.estoqueMinimo}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-charcoal-50/50">
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Produto</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Unidade</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Estoque Atual</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Estoque Minimo</th>
                <th className="px-4 py-3 text-right font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Preco</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {produtos.filter((p) => p.ativo).map((p) => {
                const baixo = p.estoqueAtual <= p.estoqueMinimo
                return (
                  <tr key={p.id} className="hover:bg-charcoal-50/50">
                    <td className="px-4 py-3 font-body text-sm font-medium text-charcoal-900">{p.nome}</td>
                    <td className="px-4 py-3 font-body text-sm text-charcoal-500">{p.unidade}</td>
                    <td className={`px-4 py-3 font-body text-sm font-bold text-center ${baixo ? 'text-red-600' : 'text-charcoal-900'}`}>{p.estoqueAtual}</td>
                    <td className="px-4 py-3 font-body text-sm text-center text-charcoal-500">{p.estoqueMinimo}</td>
                    <td className="px-4 py-3 font-body text-sm text-right text-charcoal-900">{formatarMoeda(p.preco)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={baixo ? 'warning' : 'success'}>{baixo ? 'Baixo' : 'OK'}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
