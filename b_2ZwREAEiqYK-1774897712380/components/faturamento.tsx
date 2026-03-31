'use client'

import { DollarSign, TrendingUp, Calendar, CalendarDays } from 'lucide-react'
import type { OrdemServico } from '@/lib/types'

interface FaturamentoProps {
  ordens: OrdemServico[]
}

export function Faturamento({ ordens }: FaturamentoProps) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  
  // Filtra ordens concluidas ou entregues com valor
  const ordensComValor = ordens.filter(o => 
    (o.status === 'concluido' || o.status === 'entregue') && o.valorServico && o.valorServico > 0
  )
  
  // Faturamento do dia
  const faturamentoDiario = ordensComValor
    .filter(o => {
      const dataOrdem = new Date(o.dataAtualizacao)
      dataOrdem.setHours(0, 0, 0, 0)
      return dataOrdem.getTime() === hoje.getTime()
    })
    .reduce((acc, o) => acc + (o.valorServico || 0), 0)
  
  const ordensDia = ordensComValor.filter(o => {
    const dataOrdem = new Date(o.dataAtualizacao)
    dataOrdem.setHours(0, 0, 0, 0)
    return dataOrdem.getTime() === hoje.getTime()
  }).length
  
  // Faturamento do mes
  const faturamentoMensal = ordensComValor
    .filter(o => {
      const dataOrdem = new Date(o.dataAtualizacao)
      return dataOrdem >= inicioMes
    })
    .reduce((acc, o) => acc + (o.valorServico || 0), 0)
  
  const ordensMes = ordensComValor.filter(o => {
    const dataOrdem = new Date(o.dataAtualizacao)
    return dataOrdem >= inicioMes
  }).length
  
  // Ticket medio mensal
  const ticketMedio = ordensMes > 0 ? faturamentoMensal / ordensMes : 0

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const cards = [
    {
      label: 'Faturamento Hoje',
      value: formatarMoeda(faturamentoDiario),
      subtitle: `${ordensDia} ${ordensDia === 1 ? 'servico' : 'servicos'}`,
      icon: Calendar,
      color: 'text-emerald-600 bg-emerald-100'
    },
    {
      label: 'Faturamento Mensal',
      value: formatarMoeda(faturamentoMensal),
      subtitle: `${ordensMes} ${ordensMes === 1 ? 'servico' : 'servicos'}`,
      icon: CalendarDays,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Ticket Medio',
      value: formatarMoeda(ticketMedio),
      subtitle: 'por servico',
      icon: TrendingUp,
      color: 'text-amber-600 bg-amber-100'
    }
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-emerald-100">
          <DollarSign className="h-5 w-5 text-emerald-600" />
        </div>
        <h2 className="font-semibold text-card-foreground">Faturamento</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-muted/50 rounded-lg p-3 flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-card-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
