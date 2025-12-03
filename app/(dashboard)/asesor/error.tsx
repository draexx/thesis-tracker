"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                <h2 className="text-lg font-semibold">Algo salió mal</h2>
            </div>
            <p className="text-muted-foreground text-center max-w-md">
                Hubo un error al cargar el dashboard del asesor. Por favor intenta nuevamente.
            </p>
            <Button onClick={() => reset()}>Intentar de nuevo</Button>
        </div>
    )
}
