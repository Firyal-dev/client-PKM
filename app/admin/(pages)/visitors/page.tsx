import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { getAdminVisitors, getVisitorStats } from "@/services/visitor/visitor-service"
import { Users, Calendar, BarChart3, Globe } from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

export default async function VisitorsPage() {
    const [visitors, stats] = await Promise.all([
        getAdminVisitors(),
        getVisitorStats()
    ])

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Pengunjung"
                description="Kelola dan lihat statistik pengunjung website"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pengunjung</p>
                                <p className="text-3xl font-bold mt-1">{stats.total}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Hari Ini</p>
                                <p className="text-3xl font-bold mt-1">{stats.today}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Bulan Ini</p>
                                <p className="text-3xl font-bold mt-1">{stats.thisMonth}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                                <BarChart3 className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tahun Ini</p>
                                <p className="text-3xl font-bold mt-1">{stats.thisYear}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Globe className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Visitor List */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Riwayat Pengunjung</h2>
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium">No</th>
                                        <th className="text-left p-4 font-medium">IP Address</th>
                                        <th className="text-left p-4 font-medium">Tanggal</th>
                                        <th className="text-left p-4 font-medium">Halaman</th>
                                        <th className="text-left p-4 font-medium">User Agent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                                Belum ada data pengunjung
                                            </td>
                                        </tr>
                                    ) : (
                                        visitors.map((visitor, index) => (
                                            <tr key={visitor.id} className="border-t hover:bg-muted/30">
                                                <td className="p-4">{index + 1}</td>
                                                <td className="p-4 font-mono text-sm">{visitor.ip_address}</td>
                                                <td className="p-4">
                                                    {visitor.visit_date ?
                                                        format(new Date(visitor.visit_date), 'dd MMMM yyyy', { locale: localeId })
                                                        : '-'}
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">{visitor.path || '-'}</td>
                                                <td className="p-4 text-sm text-muted-foreground max-w-xs truncate" title={visitor.user_agent}>
                                                    {visitor.user_agent}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
