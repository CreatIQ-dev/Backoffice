import classNames from 'classnames'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { useAppSelector } from '@/store'
import { HiCheck } from 'react-icons/hi'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'

type ColorOption = {
    label: string
    value: string
}

export const colorList: ColorOption[] = [
    { label: 'Red', value: 'red' },
    { label: 'Orange', value: 'orange' },
    { label: 'Amber', value: 'amber' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Lime', value: 'lime' },
    { label: 'Green', value: 'green' },
    { label: 'Emerald', value: 'emerald' },
    { label: 'Teal', value: 'teal' },
    { label: 'Cyan', value: 'cyan' },
    { label: 'Sky', value: 'sky' },
    { label: 'Blue', value: 'blue' },
    { label: 'Indigo', value: 'indigo' },
    { label: 'Violet', value: 'violet' },
    { label: 'Purple', value: 'purple' },
    { label: 'Fuchsia', value: 'fuchsia' },
    { label: 'Pink', value: 'pink' },
    { label: 'Rose', value: 'rose' },
]

const { Control } = components

const ColorBadge = ({
    className,
    themeColor,
}: {
    className?: string
    themeColor: string
}) => {
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel,
    )

    return (
        <Badge
            className={className}
            innerClass={classNames(`bg-${themeColor}-${primaryColorLevel}`)}
        />
    )
}

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<ColorOption>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center gap-2">
                <ColorBadge themeColor={data.value} />
                <span>{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomControl = ({ children, ...props }: ControlProps<ColorOption>) => {
    const selected = props.getValue()[0]

    return (
        <Control {...props}>
            {selected && (
                <ColorBadge
                    themeColor={selected.value}
                    className="ltr:ml-4 rtl:mr-4"
                />
            )}
            {children}
        </Control>
    )
}

interface ColorSelectorProps {
    value: string
    onChange: (color: string) => void
    size?: 'sm' | 'md' | 'lg'
}

const ColorSelector = ({
    value,
    onChange,
    size = 'md',
}: ColorSelectorProps) => {
    return (
        <Select<ColorOption>
            size={size}
            options={colorList}
            components={{
                Option: CustomSelectOption,
                Control: CustomControl,
            }}
            value={colorList.filter((color) => color.value === value)}
            onChange={(opt) => onChange((opt as ColorOption).value)}
        />
    )
}

export default ColorSelector
