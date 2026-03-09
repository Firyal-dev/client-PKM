"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    ExpandedState,
    useReactTable,
    ColumnFiltersState,
    RowSelectionState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    columnFilters?: ColumnFiltersState
    onColumnFiltersChange?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
    globalFilter?: string
    onGlobalFilterChange?: (value: string) => void
    hidePagination?: boolean
    onRowSelectionChange?: (selectedRows: TData[]) => void
    enableRowSelection?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    columnFilters,
    onColumnFiltersChange,
    globalFilter,
    onGlobalFilterChange,
    hidePagination = false,
    onRowSelectionChange,
    enableRowSelection = false,
}: DataTableProps<TData, TValue>) {
    const [expanded, setExpanded] = React.useState<ExpandedState>({})
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

    const finalColumns = React.useMemo(() => {
        if (!enableRowSelection) return columns
        
        return [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            } as ColumnDef<TData, TValue>,
            ...columns,
        ]
    }, [columns, enableRowSelection])

    React.useEffect(() => {
        if (onRowSelectionChange && enableRowSelection) {
            const selectedRows = data.filter((_, idx) => rowSelection[idx])
            onRowSelectionChange(selectedRows)
        }
    }, [rowSelection, enableRowSelection, onRowSelectionChange, data])

    const table = useReactTable({
        data,
        columns: finalColumns,
        state: {
            expanded,
            columnFilters,
            globalFilter,
            rowSelection: enableRowSelection ? rowSelection : {},
        },
        onExpandedChange: setExpanded,
        onColumnFiltersChange: onColumnFiltersChange,
        onGlobalFilterChange: onGlobalFilterChange,
        onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
        getSubRows: (row) => (row as any).children,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        ...(hidePagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    })

    return (
        <div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={finalColumns.length} className="h-24 text-center">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
