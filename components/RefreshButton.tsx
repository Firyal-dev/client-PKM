"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
    className?: string;
    children?: React.ReactNode;
    icon?: React.ReactNode;
}

export default function RefreshButton({
    className,
    children = "Muat Ulang Halaman",
    icon = <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
}: RefreshButtonProps) {
    return (
        <button
            onClick={() => window.location.href = "/"}
            className={cn(
                "group flex items-center justify-center gap-3 transition-all active:scale-95",
                className
            )}
        >
            {icon}
            {children}
        </button>
    );
}
