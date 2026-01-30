import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { layananList } from "@/constants/layanan"

export default function Layanan() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
                        Layanan Unggulan
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Layanan Kesehatan Kami
                    </h2>
                    <div className="w-20 h-1.5 bg-primary rounded-full mb-4"></div>
                    <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
                        Puskesmas Bogor Tengah berkomitmen memberikan pelayanan kesehatan yang prima,
                        profesional, dan terjangkau bagi seluruh lapisan masyarakat.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {layananList.map((item, index) => (
                        <Card
                            key={index}
                            className="relative overflow-hidden group border border-border/40 hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 bg-card"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                            <CardHeader className="pb-4">
                                <div className="p-4 w-16 h-16 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 flex items-center justify-center mb-6 shadow-inner">
                                    <item.icon className="w-9 h-9" strokeWidth={1.5} />
                                </div>
                                <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300 uppercase tracking-tight">
                                    {item.label}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <CardDescription className="text-base text-muted-foreground leading-relaxed line-clamp-4 min-h-[100px]">
                                    {item.desc}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
