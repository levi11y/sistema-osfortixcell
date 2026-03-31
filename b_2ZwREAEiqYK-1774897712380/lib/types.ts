export type StatusOS = 'pendente' | 'em_andamento' | 'concluido' | 'entregue'

export interface OrdemServico {
  id: string
  numero: number
  cliente: string
  telefone: string
  aparelho: string
  problema: string
  status: StatusOS
  dataCriacao: string
  dataAtualizacao: string
  observacoes?: string
  valorServico?: number
}

export const statusLabels: Record<StatusOS, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  entregue: 'Entregue'
}

export const statusColors: Record<StatusOS, string> = {
  pendente: 'bg-amber-100 text-amber-800 border-amber-200',
  em_andamento: 'bg-blue-100 text-blue-800 border-blue-200',
  concluido: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  entregue: 'bg-slate-100 text-slate-800 border-slate-200'
}
