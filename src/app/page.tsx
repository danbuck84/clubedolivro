"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MeetingCard } from "@/components/MeetingCard";
import {
  getNextMeeting,
  toggleRSVP,
  hasUserRSVP,
  countRSVPs,
  type Meeting,
} from "@/services/meetingService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    loadMeeting();
  }, [user, router]);

  async function loadMeeting() {
    try {
      const nextMeeting = await getNextMeeting();
      setMeeting(nextMeeting);
    } catch (error) {
      console.error("Error loading meeting:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRSVP() {
    if (!user || !meeting) return;

    try {
      await toggleRSVP(meeting.id, user.uid, {
        name: user.displayName || "Usuário",
        photoURL: user.photoURL || "",
      });

      // Reload meeting data
      await loadMeeting();
    } catch (error) {
      console.error("Error toggling RSVP:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2">
              Olá, {user?.displayName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-stone-600 text-lg">
              Bem-vindo ao Clube do Livro
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </header>

        {/* Meeting Section */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Próximo Encontro
          </h2>

          {meeting ? (
            <MeetingCard
              day={format(meeting.date.toDate(), "d")}
              month={format(meeting.date.toDate(), "MMM", { locale: ptBR }).toUpperCase()}
              title={`Debate: "${meeting.bookTitle}"`}
              location={meeting.locationName}
              locationLink={meeting.locationLink}
              time={meeting.time}
              confirmedCount={countRSVPs(meeting)}
              isConfirmed={hasUserRSVP(meeting, user?.uid)}
              onRSVP={handleRSVP}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-amber-50 p-8 rounded-2xl">
                  <Calendar className="w-20 h-20 text-amber-600" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                Nenhum encontro agendado
              </h3>
              <p className="text-stone-600 mb-6">
                Que tal agendar o próximo encontro do clube?
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700">
                Agendar Encontro
              </Button>
            </div>
          )}
        </section>

        {/* Info Box */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-serif text-xl font-bold text-amber-900 mb-2">
            ✅ Conectado ao Firebase!
          </h3>
          <p className="text-amber-800">
            Dados sendo carregados em tempo real do Firestore.
          </p>
          <p className="text-amber-700 text-sm mt-2">
            Auth funcionando • TypeScript • Next.js 14
          </p>
        </div>
      </div>
    </main>
  );
}
