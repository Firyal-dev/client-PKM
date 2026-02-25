import { notFound } from "next/navigation"
import { getAdminStaticPageById } from "@/services/static-page/static-page-service"
import { getAdminMenusByType } from "@/services/menu/menu-service"
import { PageHeader } from "@/components/admin/page-header"
import { StaticPageForm } from "../static-page-form"
import { updateStaticPageAction } from "@/services/static-page/static-page-service"

export default async function EditStaticPagePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params

  const [staticPage, menus] = await Promise.all([
    getAdminStaticPageById(id),
    getAdminMenusByType('static'),
  ])

  if (!staticPage) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Halaman Statis"
        description="Edit halaman statis website"
      />

      <StaticPageForm
        action={updateStaticPageAction.bind(null, id)}
        initialData={staticPage}
        menus={menus}
      />
    </div>
  )
}
