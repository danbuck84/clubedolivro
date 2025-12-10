import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingCardProps {
    day: string;
    month: string;
    title: string;
    location: string;
    locationLink?: string;
    time: string;
    confirmedCount: number;
    isConfirmed: boolean;
    onRSVP?: () => void;
}

export function MeetingCard({
    day,
    month,
    title,
    location,
    locationLink,
    time,
    confirmedCount,
    isConfirmed,
    onRSVP,
}: MeetingCardProps) {
    return (
        <div className="flex bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-all">
            {/* Sidebar Data */}
            <div className="bg-amber-50/80 w-24 flex flex-col items-center justify-center border-r border-amber-100/50 p-4">
                <span className="text-4xl font-serif font-bold text-amber-800 leading-none">
                    {day}
                </span>
                <span className="text-xs uppercase font-bold text-amber-600 tracking-widest mt-1">
                    {month}
                </span>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 p-5 flex flex-col justify-between relative">
                <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight mb-2">
                        {title}
                    </h3>
                    <div className="flex flex-col gap-1 text-sm text-stone-500">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            {locationLink ? (
                                <a
                                    href={locationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline decoration-dotted hover:text-amber-700 transition-colors"
                                >
                                    {location}
                                </a>
                            ) : (
                                <span>{location}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer: Avatares e Botão */}
                <div className="flex justify-between items-end mt-4 pt-3 border-t border-stone-100">
                    <div className="flex -space-x-2">
                        {/* Avatares Placeholders */}
                        <div className="w-8 h-8 rounded-full bg-stone-200 border-2 border-white" />
                        <div className="w-8 h-8 rounded-full bg-stone-300 border-2 border-white" />
                        {confirmedCount > 2 && (
                            <div className="w-8 h-8 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center border-2 border-white font-bold">
                                +{confirmedCount - 2}
                            </div>
                        )}
                    </div>

                    {/* Botão Shadcn Condicional */}
                    <Button
                        variant={isConfirmed ? "outline" : "default"}
                        size="sm"
                        className={
                            isConfirmed
                                ? "border-green-600 text-green-700 bg-green-50 hover:bg-green-100 h-8 text-xs rounded-full"
                                : "bg-amber-600 hover:bg-amber-700 text-white h-8 text-xs rounded-full shadow-sm"
                        }
                        onClick={onRSVP}
                    >
                        {isConfirmed ? "✓ Confirmado" : "Eu vou"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
