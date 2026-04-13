import { useState } from 'react'

const useCurrencyInput = (initialValue: number = 0) => {
    const [value, setValue] = useState<number>(initialValue)

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        }).format(value)
    }

    const parseCurrency = (formattedValue: string): number => {
        return parseFloat(formattedValue.replace(/[^0-9]/g, '') || '0') / 100
    }

    const handleChange = (formattedValue: string) => {
        const numericValue = parseCurrency(formattedValue)
        setValue(numericValue)
    }

    return {
        value,
        formattedValue: formatCurrency(value),
        handleChange,
    }
}

export default useCurrencyInput
