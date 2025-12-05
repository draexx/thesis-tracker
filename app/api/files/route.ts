import { NextResponse } from "next/server"

// TODO: Implementar integración con Google Drive/Dropbox
// Esta ruta manejará la subida de archivos y sincronización con servicios en la nube
// Se necesitará configurar las credenciales de API para cada servicio

export async function POST(req: Request) {
    return NextResponse.json(
        { error: "Endpoint no implementado. Próximamente integración con almacenamiento en la nube." },
        { status: 501 }
    )
}
