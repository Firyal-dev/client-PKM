import { PageHeader } from "@/components/admin/page-header"
import { ConsultationList } from "./consultation-list"
import { ConsultationProp } from "@/types/consultation-prop"

// Data Dummy
const dummyConsultations: ConsultationProp[] = [
    {
        id: "1",
        username: "Budi Santoso",
        phone_number: "081234567890",
        message: "Saya ingin bertanya mengenai jadwal praktek dokter gigi di hari Sabtu apakah ada?",
        answer: "Halo Pak Budi, untuk hari Sabtu klinik gigi kami buka dari jam 08.00 sampai 12.00 WIB.",
        is_publish: true,
        created_at: new Date('2024-02-01T08:00:00Z')
    },
    {
        id: "2",
        username: "Siti Aminah",
        phone_number: "085712345678",
        message: "Apakah bisa melakukan pendaftaran online untuk poli anak?",
        is_publish: false,
        created_at: new Date('2024-02-05T10:30:00Z')
    },
    {
        id: "3",
        username: "Andi Wijaya",
        message: "Tes konsultasi tanpa nomor telepon.",
        answer: "Diterima, terima kasih.",
        is_publish: true,
        created_at: new Date('2024-02-06T14:20:00Z')
    }
]

export default async function ConsultationPage() {
    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Konsultasi"
                description="Kelola tanya jawab dan konsultasi dari pengguna"
            />

            <div className="mt-6">
                <ConsultationList consultations={dummyConsultations} />
            </div>
        </div>
    )
}
