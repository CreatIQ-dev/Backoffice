import * as XLSX from 'xlsx'
import { Pedido } from '@/@types/pedidos'

export const generateQuotationExcel = (
    pedido: Pedido,
    itemsToQuote: any[],
    proveedor?: string,
) => {
    // 1. Preparar los datos de los ítems
    const data = itemsToQuote.map((item) => ({
        Code: item.codigo || '',
        Description: item.descripcion,
        Quantity: item.cantidad,
        Unit: item.unidad,
        'Est. Unit Price': item.precioUnitario || 0,
        'Est. Subtotal': (item.cantidad * (item.precioUnitario || 0)).toFixed(
            2,
        ),
        Observations: item.observaciones || '',
    }))

    // 2. Crear el libro y la estructura del encabezado
    const wb = XLSX.utils.book_new()

    // Encabezado del documento
    const projectName =
        typeof pedido.proyecto === 'object' && pedido.proyecto !== null
            ? (pedido.proyecto as any).Nombre ||
              (pedido.proyecto as any).nombre ||
              'N/A'
            : pedido.proyecto || 'N/A'

    const headerInfo = [
        ['MATERIAL QUOTATION'],
        [''],
        ['Vendor:', proveedor || 'General'],
        ['Issue Date:', new Date().toLocaleDateString('en-US')],
        ['Reference Order:', pedido.numeroPedido || 'N/A'],
        ['Project:', projectName],
        [''], // Space
    ]

    // 3. Crear la hoja con el encabezado
    const ws = XLSX.utils.aoa_to_sheet(headerInfo)

    // 4. Agregar los items debajo del encabezado (fila 8, que es indice 7)
    XLSX.utils.sheet_add_json(ws, data, { origin: 'A8' })

    // 5. Ajustar anchos de columna
    const wscols = [
        { wch: 15 }, // Código
        { wch: 45 }, // Descripción
        { wch: 10 }, // Cantidad
        { wch: 8 }, // Unidad
        { wch: 18 }, // Precio
        { wch: 18 }, // Subtotal
        { wch: 15 }, // Categoría
        { wch: 35 }, // Observaciones
    ]
    ws['!cols'] = wscols

    // 6. Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Quotation')

    // 7. Generar el nombre del archivo
    const vendorPart = proveedor ? `_${proveedor.replace(/\s+/g, '_')}` : ''
    const fileName = `Quotation_${pedido.numeroPedido || 'Order'}${vendorPart}_${new Date().toISOString().split('T')[0]}.xlsx`

    // 8. Descargar el archivo
    XLSX.writeFile(wb, fileName)
}
