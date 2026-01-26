import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function Page() {
    return (
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <FieldSet className="w-full max-w-xs">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="title">Judul</FieldLabel>
                        <Input id="title" type="text" placeholder="Judul" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="image">Foto</FieldLabel>
                        <Input id="image" type="file" />
                        <FieldDescription>
                            Maksimal 2MB
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </div>
    )
}