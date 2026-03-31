// Sistema de Ordens de Servico - v3 (WhatsApp automatico)
'use client'

import { Wrench } from 'lucide-react'
import { useOrdensServico } from '@/hooks/use-ordens-servico'
import { OrdemForm } from '@/components/ordem-form'
import { OrdensLista } from '@/components/ordens-lista'
import { Estatisticas } from '@/components/estatisticas'
import { Faturamento } from '@/components/faturamento'

export default function HomePage() {
  const { 
    ordens, 
    isLoading, 
    criarOrdem, 
    atualizarStatus, 
    atualizarOrdem, 
    excluirOrdem 
  } = useOrdensServico()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-card-foreground">Sistema OS</h1>
              <p className="text-xs text-muted-foreground">Assistencia Tecnica</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <Estatisticas ordens={ordens} />
        
        <Faturamento ordens={ordens} />
        
        <OrdemForm onSubmit={criarOrdem} />

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Ordens de Servico
          </h2>
          <OrdensLista
            ordens={ordens}
            onStatusChange={atualizarStatus}
            onDelete={excluirOrdem}
            onUpdate={atualizarOrdem}
          />
        </section>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <p className="text-xs text-center text-muted-foreground">
            Sistema OS - Assistencia Tecnica
          </p>
        </div>
      </footer>
    </div>
  )
}
