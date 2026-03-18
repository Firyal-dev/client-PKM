"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { getVisitorChartData, type VisitorChartData } from "@/services/visitor/visitor-service"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
    visitors: {
        label: "Pengunjung",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

const TIME_OPTIONS = [
    { value: "7",  label: "7 Hari Terakhir" },
    { value: "30", label: "30 Hari Terakhir" },
    { value: "90", label: "3 Bulan Terakhir" },
]

export function ChartVisitor() {
    const [days, setDays] = React.useState("30")
    const [data, setData] = React.useState<VisitorChartData[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        setLoading(true)
        getVisitorChartData(Number(days))
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [days])

    const totalVisitors = data.reduce((sum, d) => sum + d.visitors, 0)

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Grafik Pengunjung</CardTitle>
                    <CardDescription>
                        {loading
                            ? "Memuat data..."
                            : `Total ${totalVisitors.toLocaleString("id-ID")} pengunjung dalam ${days} hari terakhir`
                        }
                    </CardDescription>
                </div>
                <Select value={days} onValueChange={setDays}>
                    <SelectTrigger
                        className="hidden w-[175px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Pilih rentang waktu"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {TIME_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {loading ? (
                    <Skeleton className="aspect-auto h-[250px] w-full rounded-xl" />
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-visitors)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-visitors)"
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={Number(days) <= 7 ? 0 : 32}
                                tickFormatter={(value) =>
                                    new Date(value).toLocaleDateString("id-ID", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) =>
                                            new Date(value).toLocaleDateString("id-ID", {
                                                weekday: "short",
                                                month: "long",
                                                day: "numeric",
                                            })
                                        }
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="visitors"
                                type="natural"
                                fill="url(#fillVisitors)"
                                stroke="var(--color-visitors)"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
