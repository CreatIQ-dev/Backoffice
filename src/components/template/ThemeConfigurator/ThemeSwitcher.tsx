import Select from '@/components/ui/Select'
import ColorSelector from '@/components/shared/ColorSelector'
import {
    setThemeColor,
    setThemeColorLevel,
    useAppSelector,
    useAppDispatch,
} from '@/store'
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

const ThemeSwitcher = () => {
    const dispatch = useAppDispatch()

    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel,
    )

    const onThemeColorChange = async (value: string) => {
        dispatch(setThemeColor(value))
    }

    const onThemeColorLevelChange = async ({ value }: ColorLevelList) => {
        dispatch(setThemeColorLevel(value))
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <ColorSelector
                size="sm"
                value={themeColor}
                onChange={onThemeColorChange}
            />
            <Select<ColorLevelList>
                size="sm"
                options={colorLevelList}
                value={colorLevelList.filter(
                    (color) => color.value === primaryColorLevel,
                )}
                onChange={(opt) =>
                    onThemeColorLevelChange(opt as ColorLevelList)
                }
            />
        </div>
    )
}

export default ThemeSwitcher
