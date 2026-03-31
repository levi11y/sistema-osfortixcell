'use client'

import { ClipboardList, Clock, CheckCircle, PackageCheck } from 'lucide-react'
import type { OrdemServico } from '@/lib/types'

interface EstatisticasProps {
  ordens: OrdemServico[]
}

export function Estatisticas({ ordens }: EstatisticasProps) {
  const stats = {
    total: ordens.length,
    pendentes: ordens.filter(o => o.status === 'pendente').length,
    emAndamento: ordens.filter(o => o.status === 'em_andamento').length,
    concluidas: ordens.filter(o => o.status === 'concluido').length,
    entregues: ordens.filter(o => o.status === 'entregue').length
  }

  const cards = [
    {
      label: 'Total de OS',
      value: stats.total,
      icon: ClipboardList,
      color: 'text-primary bg-primary/10'
    },
    {
      label: 'Pendentes',
      value: stats.pendentes,
      icon: Clock,
      color: 'text-amber-600 bg-amber-100'
    },
    {
      label: 'Em Andamento',
      value: stats.emAndamento,
      icon: Clock,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Concluidas',
      value: stats.concluidas,
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-100'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
        >
          <div className={`p-2.5 rounded-lg ${card.color}`}>
            <card.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
