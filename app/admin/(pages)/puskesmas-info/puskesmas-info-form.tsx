'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { updatePuskesmasInfoAction } from '@/services/puskesmas-info-service';
import { PuskesmasInfo } from '@/types/web-info';
import { toast } from 'sonner';
import { Loader2, Save, Globe, Phone, MapPin, Share2, Image as ImageIcon, Mail, User } from 'lucide-react';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/getMediaUrl';
import dynamic from 'next/dynamic';

const RichEditor = dynamic(() => import('@/components/admin/rich-editor'), { ssr: false });

export default function PuskesmasInfoForm({ initialData }: { initialData: PuskesmasInfo }) {
    const [state, action, isPending] = useActionState(updatePuskesmasInfoAction, null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(getMediaUrl(initialData.logo));
    const [previewKepalaFoto, setPreviewKepalaFoto] = useState<string | null>(getMediaUrl(initialData.kepala_foto));

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message || 'Berhasil memperbarui informasi');
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewLogo(url);
        }
    };

    const handleKepalaFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewKepalaFoto(url);
        }
    };

    return (
        <form action={action} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* General Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Informasi Umum
                            </CardTitle>
                            <CardDescription>Konfigurasi dasar website puskesmas</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="web_title">Nama Website</Label>
                                <Input id="web_title" name="web_title" defaultValue={initialData.web_title} required placeholder="Contoh: Puskesmas Sehat Selalu" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Resmi</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input id="email" name="email" type="email" defaultValue={initialData.email} className="pl-10" placeholder="Contoh: puskesmas@id.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact">Kontak / No. Telepon</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input id="contact" name="contact" defaultValue={initialData.contact} className="pl-10" placeholder="Contoh: (021) 1234567" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Alamat Lengkap</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Textarea id="location" name="location" defaultValue={initialData.location} className="pl-10 min-h-[100px]" placeholder="Masukkan alamat lengkap puskesmas..." />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Map Coordinates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Koordinat Peta
                            </CardTitle>
                            <CardDescription>Gunakan koordinat dari Google Maps</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="lantitude">Latitude</Label>
                                <Input id="lantitude" name="lantitude" type="number" step="any" defaultValue={initialData.lantitude} placeholder="Contoh: -6.12345" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longtitude">Longitude</Label>
                                <Input id="longtitude" name="longtitude" type="number" step="any" defaultValue={initialData.longtitude} placeholder="Contoh: 106.12345" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kepala Puskesmas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Kepala Puskesmas
                            </CardTitle>
                            <CardDescription>Informasi kepala puskesmas</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="kepala_puskesmas">Nama Kepala Puskesmas</Label>
                                <Input
                                    id="kepala_puskesmas"
                                    name="kepala_puskesmas"
                                    defaultValue={initialData.kepala_puskesmas}
                                    placeholder="Contoh: dr. Ahmad Budiman, M.Kes"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Foto Kepala Puskesmas</Label>
                                <label htmlFor="kepala_foto" className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer relative w-full">
                                    {previewKepalaFoto ? (
                                        <div className="relative w-32 h-32 mb-4">
                                            <Image src={previewKepalaFoto} alt="Kepala Puskesmas Preview" fill className="object-contain" unoptimized />
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 bg-muted rounded flex items-center justify-center mb-4 text-muted-foreground">
                                            <User className="w-12 h-12" />
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        id="kepala_foto"
                                        name="kepala_foto"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handleKepalaFotoChange}
                                    />
                                    <span className="text-sm text-primary hover:underline font-medium">
                                        {previewKepalaFoto ? 'Ubah Foto' : 'Klik untuk Upload Foto'}
                                    </span>
                                    <p className="text-xs text-muted-foreground mt-2">Format: JPG, JPEG, PNG (Maks. 3MB)</p>
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Logo & Visual */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Logo Website
                            </CardTitle>
                            <CardDescription>Logo yang akan tampil di Navbar dan Footer</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <label htmlFor="logo" className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer relative w-full">
                                {previewLogo ? (
                                    <div className="relative w-32 h-32 mb-4">
                                        <Image src={previewLogo} alt="Logo Preview" fill className="object-contain" unoptimized />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 bg-muted rounded flex items-center justify-center mb-4 text-muted-foreground">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <Input type="file" id="logo" name="logo" className="hidden" accept=".jpg,.jpeg,.png" onChange={handleLogoChange} />
                                <span className="text-sm text-primary hover:underline font-medium">
                                    {previewLogo ? 'Ubah Logo' : 'Klik untuk Upload Logo'}
                                </span>
                                <p className="text-xs text-muted-foreground mt-2">Format: JPG, JPEG, PNG (Maks. 3MB)</p>
                            </label>

                            <div className="space-y-2 pt-4 border-t">
                                <Label htmlFor="theme_color">Warna Tema Website</Label>
                                <div className="flex gap-4 items-center">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border shadow-sm">
                                        <Input 
                                            id="theme_color" 
                                            name="theme_color" 
                                            type="color" 
                                            defaultValue={initialData.theme_color || '#3b82f6'} 
                                            className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer border-0" 
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Pilih Warna Utama</span>
                                        <span className="text-xs text-muted-foreground">Sesuaikan warna dasar tampilan website utama.</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="w-5 h-5" />
                                Media Sosial
                            </CardTitle>
                            <CardDescription>Tautan untuk ikon media sosial di footer</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="facebook">Facebook URL</Label>
                                <Input id="facebook" name="fb" defaultValue={initialData.social_links?.facebook} placeholder="https://facebook.com/..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram URL</Label>
                                <Input id="instagram" name="ig" defaultValue={initialData.social_links?.instagram} placeholder="https://instagram.com/..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitter">Twitter / X URL</Label>
                                <Input id="twitter" name="tw" defaultValue={initialData.social_links?.twitter} placeholder="https://twitter.com/..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="youtube">Youtube URL</Label>
                                <Input id="youtube" name="yt" defaultValue={initialData.social_links?.youtube} placeholder="https://youtube.com/..." />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sambutan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="w-5 h-5" />
                                Sambutan
                            </CardTitle>
                            <CardDescription>Konten sambut dari kepala puskesmas</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Konten Sambutan</Label>
                                <RichEditor
                                    name="Sambutan_konten"
                                    defaultValue={initialData.Sambutan_konten || ''}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={isPending} className="px-8">
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Perubahan
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
