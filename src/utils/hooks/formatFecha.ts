/**
 * Formatea una fecha a formato DD-MM-YYYY
 * Acepta tanto fechas simples (YYYY-MM-DD) como fechas ISO completas (2026-01-23T13:57:00.868+00:00)
 * @param fecha - String de fecha en formato YYYY-MM-DD o ISO 8601
 * @returns Fecha formateada como DD-MM-YYYY
 */
export const formatFecha = (fecha: string): string => {
    if (!fecha) return ''
    
    try {
        // Intentar parsear como fecha ISO completa
        const date = new Date(fecha)
        
        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            // Si no es válida, intentar el formato simple YYYY-MM-DD
            const [año, mes, día] = fecha.split('T')[0].split('-')
            return `${día}-${mes}-${año}`
        }
        
        // Formatear la fecha usando los métodos de Date
        const día = String(date.getDate()).padStart(2, '0')
        const mes = String(date.getMonth() + 1).padStart(2, '0')
        const año = date.getFullYear()
        
        return `${día}-${mes}-${año}`
    } catch (error) {
        console.error('Error al formatear fecha:', error)
        return fecha
    }
}
