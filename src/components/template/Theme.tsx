import { useEffect, useRef } from 'react'
import ConfigProvider from '@/components/ui/ConfigProvider'
import useDarkMode from '@/utils/hooks/useDarkmode'
import type { CommonProps } from '@/@types/common'
import { themeConfig } from '@/configs/theme.config'
import { useAppSelector } from '@/store'

const Theme = (props: CommonProps) => {
    const theme = useAppSelector((state) => state.theme)
    const locale = useAppSelector((state) => state.locale.currentLang)

    useDarkMode()

    const colorRef = useRef<HTMLDivElement>(null)

    const currentTheme = {
        ...themeConfig,
        ...theme,
        ...{ locale },
    }

    useEffect(() => {
        if (colorRef.current) {
            const color = getComputedStyle(colorRef.current).color
            if (color) {
                document.documentElement.style.setProperty(
                    '--theme-primary-color',
                    color,
                )
            }
        }
    }, [theme.themeColor, theme.primaryColorLevel])

    const isHexColor = theme.themeColor.startsWith('#')

    return (
        <ConfigProvider value={currentTheme}>
            <div
                ref={colorRef}
                className={
                    isHexColor
                        ? ''
                        : `text-${theme.themeColor}-${theme.primaryColorLevel}`
                }
                style={{
                    display: 'none',
                    color: isHexColor ? theme.themeColor : undefined,
                }}
            />
            {props.children}
        </ConfigProvider>
    )
}

export default Theme
