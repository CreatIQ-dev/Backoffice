import IsoLogo from '@/components/template/IsoLogo'
import { useAppSelector } from '@/store'

const HeaderLogo = () => {
    const mode = useAppSelector((state) => state.theme.mode)

    return <IsoLogo mode={mode} className="hidden md:block" />
}

export default HeaderLogo
