'use client'

import { useState } from 'react'
import Image from "next/image"
import AuthModal from "@/components/AuthModal"

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Black Unicorn Design Studio Logo"
            width={200}
            height={200}
            className="mx-auto cursor-pointer hover:opacity-80 transition-opacity"
            priority
            onClick={() => setIsAuthModalOpen(true)}
          />
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-brand font-black text-black mb-4">
          <span className="block md:inline">Black Unicorn</span>
          <span className="block md:inline md:ml-2">Design Studio</span>
        </h1>
        <p className="text-xl md:text-2xl font-body font-medium text-gray-600">
          Human centered, AI powered
        </p>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </main>
  )
}