import { useState, useEffect } from 'react'
import Select from '@/components/ui/Select'
import ColorSelector from '@/components/shared/ColorSelector' // Assuming this is the existing one
import type { ColorLevel } from '@/@types/theme'

type ColorLevelList = {
    label: string
    value: ColorLevel
}

const colorLevelList: ColorLevelList[] = [
    { label: '400', value: 400 },
    { label: '500', value: 500 },
    { label: '600', value: 600 },
    { label: '700', value: 700 },
    { label: '800', value: 800 },
    { label: '900', value: 900 },
]

interface ThemeColorSelectorProps {
    value: string
    onChange: (value: string) => void
    size?: 'sm' | 'md' | 'lg'
}

const ThemeColorSelector = ({
    value,
    onChange,
    size = 'md',
}: ThemeColorSelectorProps) => {
    // Parse initial value "blue-600" -> color: "blue", level: 600
    const parseValue = (val: string) => {
        const parts = val.split('-')
        const colorName = parts[0] || 'blue'
        const level = parts[1] ? parseInt(parts[1]) : 600
        return { color: colorName, level: level as ColorLevel }
    }

    const [selectedColor, setSelectedColor] = useState(parseValue(value).color)
    const [selectedLevel, setSelectedLevel] = useState(parseValue(value).level)

    useEffect(() => {
        const { color, level } = parseValue(value)
        setSelectedColor(color)
        setSelectedLevel(level)
    }, [value])

    const handleColorChange = (newColor: string) => {
        setSelectedColor(newColor)
        onChange(`${newColor}-${selectedLevel}`)
    }

    const handleLevelChange = (newLevel: ColorLevel) => {
        setSelectedLevel(newLevel)
        onChange(`${selectedColor}-${newLevel}`)
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <ColorSelector
                size={size}
                value={selectedColor}
                onChange={handleColorChange}
            />
            <Select<ColorLevelList>
                size={size}
                options={colorLevelList}
                value={colorLevelList.filter((l) => l.value === selectedLevel)}
                onChange={(opt) =>
                    handleLevelChange((opt as ColorLevelList).value)
                }
                isSearchable={false}
            />
        </div>
    )
}

export default ThemeColorSelector
