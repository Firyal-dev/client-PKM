import { layananList } from "@/constants/layanan"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

// Generate star points menggunakan formula matematika
// n = jumlah titik bintang, r1 = radius luar, r2 = radius dalam
function generateStarPath(cx: number, cy: number, n: number, r1: number, r2: number): string {
    const points: string[] = []
    for (let i = 0; i < n * 2; i++) {
        // Sudut: mulai dari -90° (atas) dan berputar searah jarum jam
        const angle = (Math.PI * i) / n - Math.PI / 2
        // Alternasi antara radius luar dan dalam
        const r = i % 2 === 0 ? r1 : r2
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        points.push(`${x.toFixed(2)},${y.toFixed(2)}`)
    }
    return `M${points.join("L")}Z`
}

// Generate multiple stars dengan posisi berdasarkan golden ratio
function generateStarPattern(seed: number) {
    const stars = []
    const phi = 1.618033988749 // Golden ratio
    const count = 5 + (seed % 3) // 5-7 bintang per card

    for (let i = 0; i < count; i++) {
        // Posisi menggunakan golden angle untuk distribusi yang menarik
        const goldenAngle = 2.39996322972865 // 137.5° dalam radian
        const t = (seed * 0.1 + i * goldenAngle) % (Math.PI * 2)

        // Posisi radial dari pojok kanan bawah
        const distance = 20 + (((seed + i) * phi * 17) % 60)
        const x = 85 + distance * Math.cos(t + seed) * 0.4
        const y = 85 + distance * Math.sin(t + seed) * 0.4

        // Ukuran bintang bervariasi berdasarkan fibonacci-like sequence
        const sizeBase = 3 + ((seed + i * 2) % 5)
        const r1 = sizeBase + (i % 3) * 2
        const r2 = r1 * 0.4 // Inner radius ~40% of outer

        // Rotasi bintang
        const rotation = ((seed * 37 + i * 72) % 360)

        // Opacity bervariasi
        const opacity = 0.03 + ((seed + i) % 5) * 0.015

        stars.push({ x, y, r1, r2, rotation, opacity, points: 5 + (i % 2) })
    }
    return stars
}

// Component untuk bintang siluet
function StarSilhouette({ seed }: { seed: number }) {
    const stars = generateStarPattern(seed)

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            <defs>
                {/* Gradient untuk efek fade */}
                <radialGradient id={`starGrad-${seed}`} cx="100%" cy="100%" r="80%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
            </defs>

            {stars.map((star, i) => (
                <g
                    key={i}
                    transform={`rotate(${star.rotation} ${star.x} ${star.y})`}
                    className="text-primary"
                >
                    <path
                        d={generateStarPath(star.x, star.y, star.points, star.r1, star.r2)}
                        fill="currentColor"
                        opacity={star.opacity}
                    />
                </g>
            ))}

            {/* Extra decorative circles dengan golden spiral positioning */}
            {[...Array(3)].map((_, i) => {
                const angle = (seed + i) * 2.39996322972865
                const r = 15 + i * 12
                const cx = 90 + r * Math.cos(angle) * 0.3
                const cy = 90 + r * Math.sin(angle) * 0.3
                return (
                    <circle
                        key={`circle-${i}`}
                        cx={cx}
                        cy={cy}
                        r={2 + i}
                        fill="currentColor"
                        opacity={0.02 + i * 0.01}
                        className="text-primary"
                    />
                )
            })}
        </svg>
    )
}

export default function HomePage() {
    return (
        <main>
            {/* Layanan Section */}
            <section className="py-20 px-6 bg-background">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                            Layanan Kami
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                            Pelayanan Kesehatan Terpadu
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Kami menyediakan berbagai layanan kesehatan berkualitas untuk memenuhi kebutuhan masyarakat
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {layananList.map((layanan, index) => (
                            <Card
                                key={index}
                                className="group relative p-6 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 overflow-hidden"
                            >
                                {/* Star Silhouette Pattern */}
                                <StarSilhouette seed={index * 7 + 13} />

                                {/* Background Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                        <layanan.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                                        {layanan.label}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                        {layanan.desc}
                                    </p>

                                    {/* Arrow Link */}
                                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                        <span>Selengkapnya</span>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* View All Button */}
                    <div className="text-center mt-12">
                        <Link
                            href="/pelayanan"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-95"
                        >
                            Lihat Semua Layanan
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}