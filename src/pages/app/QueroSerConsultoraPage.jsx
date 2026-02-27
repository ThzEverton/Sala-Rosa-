import { useAuth } from '../../contexts/AuthContext.jsx'
import Button from '../../components/ui/Button.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function QueroSerConsultoraPage() {
  const { user, isConsultora } = useAuth()

  function handleSolicitar() {
    toast.success('Solicitacao enviada com sucesso! A gerente ira avaliar seu pedido.')
  }

  if (isConsultora) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-rosa-100 mx-auto mb-6 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rosa-600"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        </div>
        <h2 className="font-heading text-2xl font-bold text-charcoal-900 mb-2">Voce ja e uma Consultora!</h2>
        <p className="font-body text-charcoal-500">Voce ja tem acesso aos servicos e cursos exclusivos para consultoras.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-rosa-100 mx-auto mb-6 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rosa-600"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        </div>
        <h2 className="font-heading text-3xl font-bold text-charcoal-900 mb-3">Seja uma Consultora Sala Rosa</h2>
        <p className="font-body text-charcoal-500 leading-relaxed">
          Faca parte do nosso time de consultoras e tenha acesso a cursos exclusivos,
          treinamentos especializados e descontos em servicos.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-charcoal-100 p-6 mb-8">
        <h3 className="font-heading font-semibold text-charcoal-900 mb-4">Beneficios de ser Consultora</h3>
        <ul className="flex flex-col gap-3">
          {[
            'Acesso a cursos exclusivos de colorimetria e tecnicas avancadas',
            'Treinamentos de vendas e empreendedorismo',
            'Descontos especiais em servicos e produtos',
            'Networking com outras consultoras e profissionais',
            'Certificados de conclusao dos cursos',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rosa-500 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              <span className="font-body text-sm text-charcoal-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={handleSolicitar}>Quero ser Consultora</Button>
        <p className="font-body text-xs text-charcoal-400 mt-3">
          Sua solicitacao sera analisada pela gerente da Sala Rosa.
        </p>
      </div>
    </div>
  )
}
