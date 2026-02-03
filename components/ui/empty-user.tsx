import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    className?: string;
}

export function EmptyState({ title, description, icon: Icon, className }: EmptyStateProps) {
    return (
        <div className={cn("w-full flex flex-col items-center justify-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center", className)}>
            {Icon && (
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 animate-in fade-in zoom-in duration-500">
                    <Icon className="w-10 h-10 text-slate-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-slate-500 text-center text-sm mt-1 max-w-xs mx-auto">
                {description}
            </p>
        </div>
    );
}
