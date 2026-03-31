'use client'

import { useState } from 'react'
import { Search, Filter, FileX } from 'lucide-react'
import type { OrdemServico, StatusOS } from '@/lib/types'
import { statusLabels } from '@/lib/types'
import { OrdemCard } from './ordem-card'

interface OrdensListaProps {
  ordens: OrdemServico[]
  onStatusChange: (id: string, status: StatusOS) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, dados: Partial<OrdemServico>) => void
}

export function OrdensLista({ ordens, onStatusChange, onDelete, onUpdate }: OrdensListaProps) {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<StatusOS | 'todos'>('todos')

  const ordensFiltradas = ordens.filter(ordem => {
    const matchBusca = 
      ordem.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      ordem.aparelho.toLowerCase().includes(busca.toLowerCase()) ||
      ordem.numero.toString().includes(busca)
    
    const matchStatus = filtroStatus === 'todos' || ordem.status === filtroStatus

    return matchBusca && matchStatus
  })

  const contadores = {
    todos: ordens.length,
    pendente: ordens.filter(o => o.status === 'pendente').length,
    em_andamento: ordens.filter(o => o.status === 'em_andamento').length,
    concluido: ordens.filter(o => o.status === 'concluido').length,
    entregue: ordens.filter(o => o.status === 'entregue').length
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por cliente, aparelho ou numero..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as StatusOS | 'todos')}
            className="w-full sm:w-48 pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none cursor-pointer"
          >
            <option value="todos">Todos ({contadores.todos})</option>
            <option value="pendente">Pendente ({contadores.pendente})</option>
            <option value="em_andamento">Em Andamento ({contadores.em_andamento})</option>
            <option value="concluido">Concluido ({contadores.concluido})</option>
            <option value="entregue">Entregue ({contadores.entregue})</option>
          </select>
        </div>
      </div>

      {ordensFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileX className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-1">
            Nenhuma ordem encontrada
          </h3>
          <p className="text-sm text-muted-foreground">
            {ordens.length === 0 
              ? 'Comece criando uma nova ordem de servico acima.'
              : 'Tente ajustar os filtros de busca.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {ordensFiltradas.map(ordem => (
            <OrdemCard
              key={ordem.id}
              ordem={ordem}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
