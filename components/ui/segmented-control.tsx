"use client"

import React from "react"
import { cn } from "@/lib/utils"

export type SegmentedOption<T extends string> = {
  label: string
  value: T
}

type SegmentedControlProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: SegmentedOption<T>[]
  className?: string
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
}: SegmentedControlProps<T>) {
  const activeIndex = options.findIndex((opt) => opt.value === value)

  return (
    <div
      className={cn(
        "relative flex rounded-lg bg-muted p-1",
        className
      )}
    >
      <div className="absolute inset-0 p-1 pointer-events-none">
        <div
          className="h-full rounded-md bg-background shadow transition-transform duration-300 ease-in-out"
          style={{
            width: `${100 / options.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>

      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            value === option.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}