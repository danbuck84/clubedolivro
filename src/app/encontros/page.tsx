"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MeetingCard } from "@/components/MeetingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getAllMeetings, toggleRSVP, hasUserRSVP, countRSVPs, Meeting } from "@/services/meetingService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Plus, Calendar } from "lucide-react";

export default function MeetingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [meetings, setMeetings] = useState<{ upcoming: Meeting[], past: Meeting[] }>({ upcoming: [], past: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("upcoming");

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }
        loadMeetings();
    }, [user, router]);

    async function loadMeetings() {
        try {
            const data = await getAllMeetings();
            setMeetings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleRSVP(meetingId: string) {
        if (!user) return;
        await toggleRSVP(meetingId, user.uid, { name: user.displayName || "", photoURL: user.photoURL || "" });
        loadMeetings();
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <main className="max-w-2xl mx-auto p-6">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="font-serif text-4xl font-bold text-stone-900">Encontros</h1>
                    <Link href="/encontros/criar">
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                            <Plus className="w-4 h-4 mr-1" />
                            Novo
                        </Button>
                    </Link>
                </header>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full mb-6">
                        <TabsTrigger value="upcoming" className="flex-1">Próximos</TabsTrigger>
                        <TabsTrigger value="past" className="flex-1">Passados</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4">
                        {meetings.upcoming.length > 0 ? (
                            meetings.upcoming.map((meeting) => (
                                <MeetingCard
                                    key={meeting.id}
                                    day={format(meeting.date.toDate(), "d")}
                                    month={format(meeting.date.toDate(), "MMM", { locale: ptBR }).toUpperCase()}
                                    title={`Debate: "${meeting.bookTitle}"`}
                                    location={meeting.locationName}
                                    locationLink={meeting.locationLink}
                                    time={meeting.time}
                                    confirmedCount={countRSVPs(meeting)}
                                    isConfirmed={hasUserRSVP(meeting, user?.uid)}
                                    onRSVP={() => handleRSVP(meeting.id)}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                                <Calendar className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                                    Nenhum encontro agendado
                                </h3>
                                <p className="text-stone-600 mb-4">Que tal criar o próximo?</p>
                                <Link href="/encontros/criar">
                                    <Button className="bg-amber-600 hover:bg-amber-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agendar Encontro
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4">
                        {meetings.past.length > 0 ? (
                            meetings.past.map((meeting) => (
                                <MeetingCard
                                    key={meeting.id}
                                    day={format(meeting.date.toDate(), "d")}
                                    month={format(meeting.date.toDate(), "MMM", { locale: ptBR }).toUpperCase()}
                                    title={`Debate: "${meeting.bookTitle}"`}
                                    location={meeting.locationName}
                                    locationLink={meeting.locationLink}
                                    time={meeting.time}
                                    confirmedCount={countRSVPs(meeting)}
                                    isConfirmed={hasUserRSVP(meeting, user?.uid)}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                                <Calendar className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                                    Sem histórico ainda
                                </h3>
                                <p className="text-stone-600">Os encontros realizados aparecerão aqui</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
            <Navbar />
        </div>
    );
}
