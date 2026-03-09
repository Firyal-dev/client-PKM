import { redirect } from "next/navigation"
import { getActivityLogs } from "@/services/activity-log/activity-log-service"
import { PageHeader } from "@/components/admin/page-header"
import { ActivityLogList } from "./activity-log-list"

export const metadata = {
  title: "Activity Logs - Admin",
  description: "Monitor system and user activities",
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ActivityLogsPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  // Get pagination params
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
  const limit = typeof params.limit === 'string' ? parseInt(params.limit, 10) : 20
  
  // Get filter params
  const filters = {
    page,
    limit: Math.min(limit, 100),
    module: typeof params.module === 'string' ? params.module : undefined,
    action: typeof params.action === 'string' ? params.action : undefined,
    startDate: typeof params.startDate === 'string' ? params.startDate : undefined,
    endDate: typeof params.endDate === 'string' ? params.endDate : undefined,
  }

  // Fetch data
  const response = await getActivityLogs(filters)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Logs"
        description="Monitor system and user activities"
      />
      
      <ActivityLogList 
        initialLogs={response.data}
        initialMeta={response.meta}
      />
    </div>
  )
}
