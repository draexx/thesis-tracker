import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <FileQuestion className="h-20 w-20 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-3xl">404</CardTitle>
                    <CardDescription className="text-lg">
                        Página no encontrada
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        La página que buscas no existe o ha sido movida.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button asChild>
                            <Link href="/">
                                Volver al inicio
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/ranking">
                                Ver ranking
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
