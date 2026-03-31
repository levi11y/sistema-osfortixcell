'use client'

import { useState } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Smartphone, 
  Calendar, 
  FileText,
  Trash2,
  Download,
  MessageCircle
} from 'lucide-react'
import type { OrdemServico, StatusOS } from '@/lib/types'
import { statusLabels, statusColors } from '@/lib/types'

interface OrdemCardProps {
  ordem: OrdemServico
  onStatusChange: (id: string, status: StatusOS) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, dados: Partial<OrdemServico>) => void
}

const statusOptions: StatusOS[] = ['pendente', 'em_andamento', 'concluido', 'entregue']

export function OrdemCard({ ordem, onStatusChange, onDelete, onUpdate }: OrdemCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [observacoes, setObservacoes] = useState(ordem.observacoes || '')
  const [valorServico, setValorServico] = useState(ordem.valorServico?.toString() || '')

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSaveDetails = () => {
    onUpdate(ordem.id, {
      observacoes,
      valorServico: valorServico ? parseFloat(valorServico) : undefined
    })
  }

  const handleImprimir = () => {
    const statusLabel: Record<string, string> = {
      pendente: 'Pendente',
      em_andamento: 'Em Andamento',
      concluido: 'Concluido',
      entregue: 'Entregue'
    }
    
    const valor = valorServico ? parseFloat(valorServico) : ordem.valorServico
    const obs = observacoes || ordem.observacoes
    
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>OS #${ordem.numero.toString().padStart(4, '0')}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
          .header h1 { font-size: 24px; margin-bottom: 5px; }
          .header p { color: #666; font-size: 14px; }
          .os-number { background: #f0f0f0; padding: 10px; text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; }
          .section { margin-bottom: 15px; }
          .section-title { font-weight: bold; color: #555; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
          .section-content { background: #f9f9f9; padding: 10px; border-radius: 4px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .valor { font-size: 24px; font-weight: bold; color: #2563eb; text-align: center; padding: 15px; background: #eff6ff; border-radius: 8px; margin: 20px 0; }
          .assinatura { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .assinatura-linha { border-top: 1px solid #333; padding-top: 5px; text-align: center; font-size: 12px; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #999; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Assistencia Tecnica</h1>
          <p>Ordem de Servico</p>
        </div>
        <div class="os-number">OS #${ordem.numero.toString().padStart(4, '0')}</div>
        <div class="grid">
          <div class="section">
            <div class="section-title">Cliente</div>
            <div class="section-content">${ordem.cliente}</div>
          </div>
          <div class="section">
            <div class="section-title">Telefone</div>
            <div class="section-content">${ordem.telefone}</div>
          </div>
        </div>
        <div class="grid">
          <div class="section">
            <div class="section-title">Aparelho</div>
            <div class="section-content">${ordem.aparelho}</div>
          </div>
          <div class="section">
            <div class="section-title">Status</div>
            <div class="section-content">${statusLabel[ordem.status]}</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Problema Relatado</div>
          <div class="section-content">${ordem.problema}</div>
        </div>
        ${obs ? `<div class="section"><div class="section-title">Observacoes Tecnicas</div><div class="section-content">${obs}</div></div>` : ''}
        ${valor ? `<div class="valor">Valor: R$ ${valor.toFixed(2)}</div>` : ''}
        <div class="section">
          <div class="section-title">Data de Abertura</div>
          <div class="section-content">${new Date(ordem.dataCriacao).toLocaleDateString('pt-BR')} as ${new Date(ordem.dataCriacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div class="assinatura">
          <div class="assinatura-linha">Assinatura do Tecnico</div>
          <div class="assinatura-linha">Assinatura do Cliente</div>
        </div>
        <div class="footer">Documento gerado em ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}</div>
      </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  const handleEnviarWhatsApp = () => {
    const telefoneNumeros = ordem.telefone.replace(/\D/g, '')
    const telefoneFormatado = telefoneNumeros.startsWith('55') ? telefoneNumeros : `55${telefoneNumeros}`
    
    let mensagem = ''
    switch (ordem.status) {
      case 'pendente':
        mensagem = `Ola ${ordem.cliente}! Sua OS #${ordem.numero.toString().padStart(4, '0')} do aparelho ${ordem.aparelho} foi registrada e esta aguardando analise. Em breve entraremos em contato com o diagnostico.`
        break
      case 'em_andamento':
        mensagem = `Ola ${ordem.cliente}! Informamos que sua OS #${ordem.numero.toString().padStart(4, '0')} do aparelho ${ordem.aparelho} esta em andamento. ${observacoes ? `Observacao: ${observacoes}` : ''}`
        break
      case 'concluido':
        mensagem = `Ola ${ordem.cliente}! Sua OS #${ordem.numero.toString().padStart(4, '0')} do aparelho ${ordem.aparelho} foi concluida! ${valorServico ? `Valor do servico: R$ ${parseFloat(valorServico).toFixed(2)}` : ''} Por favor, entre em contato para agendar a retirada.`
        break
      case 'entregue':
        mensagem = `Ola ${ordem.cliente}! Agradecemos pela preferencia! Sua OS #${ordem.numero.toString().padStart(4, '0')} do aparelho ${ordem.aparelho} foi entregue. Qualquer duvida estamos a disposicao.`
        break
    }
    
    const url = `https://wa.me/${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                OS #{ordem.numero.toString().padStart(4, '0')}
              </span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusColors[ordem.status]}`}>
                {statusLabels[ordem.status]}
              </span>
            </div>
            <h3 className="font-semibold text-card-foreground truncate">{ordem.cliente}</h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Smartphone className="h-3.5 w-3.5" />
                {ordem.aparelho}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {ordem.telefone}
              </span>
            </div>
          </div>
          <button 
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={expanded ? 'Recolher' : 'Expandir'}
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-1">
              <FileText className="h-4 w-4" />
              Problema Relatado
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              {ordem.problema}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Criado em: {formatarData(ordem.dataCriacao)}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Status
              </label>
              <select
                value={ordem.status}
                onChange={(e) => onStatusChange(ordem.id, e.target.value as StatusOS)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Valor do Servico (R$)
              </label>
              <input
                type="number"
                value={valorServico}
                onChange={(e) => setValorServico(e.target.value)}
                onBlur={handleSaveDetails}
                placeholder="0,00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Observacoes Tecnicas
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              onBlur={handleSaveDetails}
              placeholder="Adicione observacoes sobre o servico..."
              rows={3}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
            <button
              onClick={() => onDelete(ordem.id)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEnviarWhatsApp}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </button>

              <button
                onClick={handleImprimir}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all"
              >
<Download className="h-4 w-4" />
              Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
