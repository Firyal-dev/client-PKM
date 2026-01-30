// app/admin/(pages)/albums/create-album/page.tsx
'use client'

import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useActionState } from 'react'
import { createAlbum } from '@/services/album/album-service'
import { CustomLink } from '@/components/ui/link'

export default function CreateAlbumPage() {
    const [state, formAction, isPending] = useActionState(createAlbum, null)

    return (
        <div className="gap-6 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Buat Album</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="grid gap-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="title">Judul Album</FieldLabel>
                                <Input id="title" name="album_title" type="text" placeholder="Masukkan judul album" required />
                            </Field>
                            {state?.error && (
                                <p className="text-sm font-medium text-destructive text-center mb-2">{state.error}</p>
                            )}
                            <div className="flex items-center gap-2">
                                <CustomLink href="/admin/albums" variant="outline">
                                    Kembali
                                </CustomLink>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Memuat..." : "Buat Album"}
                                </Button>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}