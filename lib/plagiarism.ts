// TODO: Integración con Turnitin para antiplagio
// Este módulo se encargará de enviar documentos a Turnitin y recuperar reportes

export const checkPlagiarism = async (fileUrl: string) => {
    console.log(`[TODO] Analizando plagio para archivo: ${fileUrl}`)
    return {
        score: 0,
        reportUrl: "#"
    }
}
