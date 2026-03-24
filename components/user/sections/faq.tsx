"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Consultation } from "@/services/consultation/consultation-service"
import { HelpCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Faq({ data = [] }: { data: Consultation[] }) {
    const t = useTranslations('Faq')
    if (data.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-slate-50/50" id="faq">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-3 mb-12">
                    <div className="flex items-center gap-2">
                        <span className="block w-6 h-px bg-blue-400" />
                        <span className="text-[10px] font-bold tracking-[0.18em] text-blue-500 uppercase">{t('label')}</span>
                        <span className="block w-6 h-px bg-blue-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{t('title')}</h2>
                    <p className="text-sm md:text-base text-slate-500 max-w-2xl px-4">
                        {t('desc')}
                    </p>
                </div>

                <div className={`max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden`}>
                    <div className={`p-2 md:p-4 ${data.length > 5 ? 'max-h-[600px] overflow-y-auto custom-scrollbar' : ''}`}>
                        <Accordion type="single" collapsible className="w-full">
                            {data.map((item, index) => (
                                <AccordionItem key={item.id} value={`item-${index}`} className="border-slate-100 last:border-0 px-4">
                                    <AccordionTrigger className="text-left py-5 text-sm md:text-base font-semibold text-slate-800 hover:text-blue-600 hover:no-underline transition-colors">
                                        <div className="flex gap-3 items-start">
                                            <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                            <span>{item.subject}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="bg-slate-50 rounded-xl p-5 space-y-4 border border-slate-100">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('question')}</p>
                                                <p className="text-sm text-slate-600 italic">"{item.message}"</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{t('answer')}</p>
                                                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
                
                {data.length > 5 && (
                    <p className="text-center mt-6 text-xs text-slate-400">
                        {t('scrollHint')}
                    </p>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </section>
    )
}
