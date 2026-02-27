import { getAdminPuskesmasInfo } from '@/services/puskesmas-info-service';
import PuskesmasInfoForm from './puskesmas-info-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function PuskesmasInfoPage() {
    const initialData = await getAdminPuskesmasInfo();

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Informasi Puskesmas</h1>
                <p className="text-muted-foreground">
                    Kelola identitas website, lokasi, dan kontak resmi puskesmas.
                </p>
            </div>

            <PuskesmasInfoForm initialData={initialData} />
        </div>
    );
}
