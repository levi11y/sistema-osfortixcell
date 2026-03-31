'use client'

import { useState } from 'react'
import { Plus, User, Phone, Smartphone, FileText } from 'lucide-react'

interface OrdemFormProps {
  onSubmit: (dados: {
    cliente: string
    telefone: string
    aparelho: string
    problema: string
  }) => { numero: number } | void
}

export function OrdemForm({ onSubmit }: OrdemFormProps) {
  const [cliente, setCliente] = useState('')
  const [telefone, setTelefone] = useState('')
  const [aparelho, setAparelho] = useState('')
  const [problema, setProblema] = useState('')

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '')
    if (numeros.length <= 2) return numeros
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
    if (numeros.length <= 11) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatarTelefone(e.target.value))
  }

  const enviarWhatsAppNovaOS = (dados: { cliente: string; telefone: string; aparelho: string; numero: number }) => {
    const telefoneNumeros = dados.telefone.replace(/\D/g, '')
    const telefoneFormatado = telefoneNumeros.startsWith('55') ? telefoneNumeros : `55${telefoneNumeros}`
    
    const mensagem = `Ola ${dados.cliente}! Sua OS #${dados.numero.toString().padStart(4, '0')} do aparelho ${dados.aparelho} foi registrada e esta aguardando analise. Em breve entraremos em contato com o diagnostico.`
    
    const url = `https://wa.me/${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cliente.trim() || !telefone.trim() || !aparelho.trim() || !problema.trim()) {
      return
    }

    const result = onSubmit({ cliente, telefone, aparelho, problema })
    
    if (result && result.numero) {
      enviarWhatsAppNovaOS({ cliente, telefone, aparelho, numero: result.numero })
    }
    
    setCliente('')
    setTelefone('')
    setAparelho('')
    setProblema('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-card-foreground mb-5">Nova Ordem de Servico</h2>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <label htmlFor="cliente" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Cliente
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="cliente"
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nome do cliente"
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="telefone" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Telefone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={handleTelefoneChange}
              placeholder="(00) 00000-0000"
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="relative sm:col-span-2">
          <label htmlFor="aparelho" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Aparelho
          </label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="aparelho"
              type="text"
              value={aparelho}
              onChange={(e) => setAparelho(e.target.value)}
              placeholder="Modelo do aparelho"
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="relative sm:col-span-2">
          <label htmlFor="problema" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Problema Relatado
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <textarea
              id="problema"
              value={problema}
              onChange={(e) => setProblema(e.target.value)}
              placeholder="Descreva o problema do aparelho"
              rows={3}
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
      >
        <Plus className="h-4 w-4" />
        Criar Ordem de Servico
      </button>
    </form>
  )
}
