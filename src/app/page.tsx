"use client";

import { MeetingCard } from "@/components/MeetingCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2">
            Clube do Livro
          </h1>
          <p className="text-stone-600 text-lg">
            Bem-vindo ao novo visual! ✨
          </p>
        </header>

        {/* Meeting Card Demo */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Próximo Encontro
          </h2>

          <MeetingCard
            day="15"
            month="JAN"
            title='Debate: "O Conto da Aia"'
            location="Cafeteria Central"
            locationLink="https://maps.google.com"
            time="19:00h"
            confirmedCount={8}
            isConfirmed={false}
            onRSVP={() => console.log("RSVP clicked!")}
          />

          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-12">
            Encontro Confirmado
          </h2>

          <MeetingCard
            day="22"
            month="DEZ"
            title='Leitura: "1984"'
            location="Biblioteca Municipal"
            time="18:30h"
            confirmedCount={5}
            isConfirmed={true}
          />
        </section>

        {/* Info Box */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-serif text-xl font-bold text-amber-900 mb-2">
            🎉 Migração Completa!
          </h3>
          <p className="text-amber-800">
            Projeto migrado para <strong>Next.js 14</strong> +{" "}
            <strong>TypeScript</strong> + <strong>Shadcn/UI</strong>
          </p>
          <p className="text-amber-700 text-sm mt-2">
            Design system "Cozy & Professional" implementado com Tailwind CSS e
            componentes Radix UI.
          </p>
        </div>
      </div>
    </main>
  );
}
