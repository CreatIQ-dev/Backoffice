import { useCallback } from 'react'
import useDarkMode from '@/utils/hooks/useDarkmode'
import Switcher from '@/components/ui/Switcher'

const ModeSwitcher = () => {
    const [isDark, setIsDark] = useDarkMode()

    const onSwitchChange = useCallback(
        async (checked: boolean) => {
            const newMode: 'light' | 'dark' = checked ? 'dark' : 'light'
            setIsDark(newMode)
        },
        [setIsDark],
    )

    return (
        <div>
            <Switcher
                checked={isDark}
                onChange={(checked) => onSwitchChange(checked)}
            />
        </div>
    )
}

export default ModeSwitcher
