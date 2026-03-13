import { getPuskesmasList } from "@/services/puskesmas-list-service";
import { Puskesmas } from "@/types/puskesmas-prop";

export default async function PuskesmasPage() {
    const puskesmasList = await getPuskesmasList(1, 10);

    return (
        <div>
            <h1>Puskesmas</h1>
            <ul>
                {puskesmasList.docs.map((puskesmas: Puskesmas) => (
                    <li key={puskesmas.id}>{puskesmas.name}</li>
                ))}
            </ul>
        </div>
    );
}