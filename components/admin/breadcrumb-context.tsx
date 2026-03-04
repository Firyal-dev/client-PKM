"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface BreadcrumbContextType {
    title: string | null
    setTitle: (title: string | null) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitleState] = useState<string | null>(null)

    const setTitle = useCallback((newTitle: string | null) => {
        setTitleState(newTitle)
    }, [])

    return (
        <BreadcrumbContext.Provider value={{ title, setTitle }}>
            {children}
        </BreadcrumbContext.Provider>
    )
}

export function useBreadcrumb() {
    const context = useContext(BreadcrumbContext)
    if (context === undefined) {
        throw new Error("useBreadcrumb must be used within a BreadcrumbProvider")
    }
    return context
}

export function SetBreadcrumb({ title }: { title: string }) {
    const { setTitle } = useBreadcrumb()

    React.useEffect(() => {
        setTitle(title)
        return () => setTitle(null)
    }, [title, setTitle])

    return null
}
