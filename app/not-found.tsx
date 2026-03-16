'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    document.body.setAttribute('data-page', 'not-found')
    return () => document.body.removeAttribute('data-page')
  }, [])

  return (
    <div className="flex min-h-[calc(100vh-72px)] mt-[72px] flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] -z-10 h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px] animate-pulse delay-1000" />

      <div
        className="absolute inset-0 -z-20 opacity-[0.03] select-none pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container relative z-10 flex flex-col items-center text-center px-4">
        <div className="relative mb-8 group">
          <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary/40 via-primary/20 to-transparent select-none transition-all duration-700 group-hover:from-primary/60 group-hover:via-primary/30">
            404
          </h1>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-24 w-24 mb-4 bg-primary/10 rounded-3xl rotate-12 flex items-center justify-center border border-primary/20 backdrop-blur-sm group-hover:rotate-0 transition-transform duration-500">
              <span className="text-5xl">🧭</span>
            </div>
            <span className="text-2xl md:text-3xl font-bold font-heading tracking-tight bg-background/50 backdrop-blur-md px-4 py-1 rounded-full border border-border/50">
              Halaman Tidak Ditemukan
            </span>
          </div>
        </div>

        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-heading tracking-tight">Oopss! Anda Tersesat</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
              Mari kembali ke jalur yang benar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full px-8 backdrop-blur-sm hover:bg-muted/50 border-input/50 hover:border-input transition-all duration-300"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Halaman Sebelumnya
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}