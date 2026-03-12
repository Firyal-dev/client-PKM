'use client'

import { Search, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFilterProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: {
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    placeholder: string
  }[]
  onReset: () => void
  hasActiveFilter: boolean
  searchPlaceholder?: string
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  filters = [],
  onReset,
  hasActiveFilter,
  searchPlaceholder = "Cari...",
}: SearchFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-1 flex-wrap">
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9 rounded-xl text-sm"
        />
      </div>
      {filters.map((filter, index) => (
        <Select key={index} value={filter.value || "all"} onValueChange={filter.onChange}>
          <SelectTrigger className="w-[150px] shrink-0 h-9 rounded-xl border-border/60 text-sm gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {hasActiveFilter && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground rounded-xl gap-1">
          <X className="w-3.5 h-3.5" /> Reset
        </Button>
      )}
    </div>
  )
}