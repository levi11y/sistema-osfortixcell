'use client'

import { useState, useEffect, useCallback } from 'react'
import type { OrdemServico, StatusOS } from '@/lib/types'

const STORAGE_KEY = 'ordens_servico'
const COUNTER_KEY = 'os_counter'

function getStoredOrdens(): OrdemServico[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function getNextNumber(): number {
  if (typeof window === 'undefined') return 1
  const counter = localStorage.getItem(COUNTER_KEY)
  const next = counter ? parseInt(counter, 10) + 1 : 1
  localStorage.setItem(COUNTER_KEY, next.toString())
  return next
}

export function useOrdensServico() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setOrdens(getStoredOrdens())
    setIsLoading(false)
  }, [])

  const saveToStorage = useCallback((data: OrdemServico[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [])

  const criarOrdem = useCallback((dados: {
    cliente: string
    telefone: string
    aparelho: string
    problema: string
  }): OrdemServico => {
    const agora = new Date().toISOString()
    const novaOrdem: OrdemServico = {
      id: crypto.randomUUID(),
      numero: getNextNumber(),
      cliente: dados.cliente,
      telefone: dados.telefone,
      aparelho: dados.aparelho,
      problema: dados.problema,
      status: 'pendente',
      dataCriacao: agora,
      dataAtualizacao: agora
    }

    setOrdens(prev => {
      const updated = [novaOrdem, ...prev]
      saveToStorage(updated)
      return updated
    })

    return novaOrdem
  }, [saveToStorage])

  const atualizarStatus = useCallback((id: string, status: StatusOS) => {
    setOrdens(prev => {
      const updated = prev.map(os =>
        os.id === id
          ? { ...os, status, dataAtualizacao: new Date().toISOString() }
          : os
      )
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const atualizarOrdem = useCallback((id: string, dados: Partial<OrdemServico>) => {
    setOrdens(prev => {
      const updated = prev.map(os =>
        os.id === id
          ? { ...os, ...dados, dataAtualizacao: new Date().toISOString() }
          : os
      )
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const excluirOrdem = useCallback((id: string) => {
    setOrdens(prev => {
      const updated = prev.filter(os => os.id !== id)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const buscarOrdem = useCallback((id: string): OrdemServico | undefined => {
    return ordens.find(os => os.id === id)
  }, [ordens])

  return {
    ordens,
    isLoading,
    criarOrdem,
    atualizarStatus,
    atualizarOrdem,
    excluirOrdem,
    buscarOrdem
  }
}
