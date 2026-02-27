import { useState, useEffect } from 'react'
import { getServicos } from '../../services/api.js'
import { formatarMoeda } from '../../utils/dateUtils.js'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Link } from 'react-router-dom'

export default function ServicosPage() {
  const [servicos, setServicos] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getServicos().then((data) => setServicos(data.filter((s) => s.ativo && !s.exclusivoParaConsultora)))
  }, [])

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-rosa-500 font-body font-semibold text-sm tracking-wider uppercase mb-3 block">Nossos Servicos</span>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-charcoal-900 mb-4">
            Tratamentos & Servicos
          </h1>
          <p className="font-body text-charcoal-500 max-w-2xl mx-auto">
            Descubra nossa linha completa de servicos de beleza, todos realizados por profissionais qualificadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-charcoal-100 overflow-hidden hover:shadow-lg hover:border-rosa-200 transition-all cursor-pointer group"
              onClick={() => setSelected(s)}
            >
              <div className="h-44 bg-rosa-50 flex items-center justify-center group-hover:bg-rosa-100 transition-colors">
                <span className="font-heading text-rosa-400 text-lg px-4 text-center">{s.nome}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-semibold text-charcoal-900">{s.nome}</h3>
                  <Badge variant="rosa">{s.duracao} min</Badge>
                </div>
                <p className="font-body text-sm text-charcoal-500 mb-3 line-clamp-2">{s.descricao}</p>
                <div className="flex items-center justify-between">
                  <span className="font-body font-bold text-lg text-rosa-600">{formatarMoeda(s.preco)}</span>
                  <Button variant="outline" size="sm">Ver detalhes</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.nome || ''}>
        {selected && (
          <div>
            <div className="mb-4">
              <div className="h-48 bg-rosa-50 rounded-lg flex items-center justify-center mb-4">
                <span className="font-heading text-rosa-400 text-xl">{selected.nome}</span>
              </div>
              <p className="font-body text-charcoal-600 leading-relaxed mb-4">{selected.descricao}</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm text-charcoal-400">Duracao:</span>
                  <Badge>{selected.duracao} min</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm text-charcoal-400">Preco:</span>
                  <span className="font-body font-bold text-rosa-600">{formatarMoeda(selected.preco)}</span>
                </div>
              </div>
            </div>
            <Link to="/login">
              <Button className="w-full">Agendar este servico</Button>
            </Link>
          </div>
        )}
      </Modal>
    </div>
  )
}
