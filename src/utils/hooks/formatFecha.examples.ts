// Ejemplos de uso de formatFecha

import { formatFecha } from './formatFecha'

// Ejemplos de prueba
console.log('=== Pruebas de formatFecha ===')

// Fecha ISO completa con timezone
console.log('ISO completa:', formatFecha('2026-01-23T13:57:00.868+00:00'))
// Resultado esperado: 23-01-2026

// Fecha ISO sin timezone
console.log('ISO sin TZ:', formatFecha('2026-01-23T13:57:00'))
// Resultado esperado: 23-01-2026

// Fecha simple YYYY-MM-DD
console.log('Fecha simple:', formatFecha('2026-01-23'))
// Resultado esperado: 23-01-2026

// Fecha vacía
console.log('Fecha vacía:', formatFecha(''))
// Resultado esperado: ''

// Diferentes meses y días
console.log('Enero:', formatFecha('2026-01-05T10:30:00.000Z'))
// Resultado esperado: 05-01-2026

console.log('Diciembre:', formatFecha('2026-12-31T23:59:59.999Z'))
// Resultado esperado: 31-12-2026

/**
 * Casos de uso en componentes:
 * 
 * // En PagosList.tsx
 * <Td className="text-center no-wrap w-2/12">
 *     {formatFecha(pago.fechaPago)}
 * </Td>
 * 
 * // En PresupuestoInfo.tsx
 * <p>Fecha: {formatFecha(presupuesto.fechaCreacion)}</p>
 */
