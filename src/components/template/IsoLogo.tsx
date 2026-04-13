import classNames from 'classnames'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
}

const IsoLogo = (props: LogoProps) => {
    const { type = 'full', className, style, logoWidth = 'auto' } = props

    const logoSrc =
        type === 'full'
            ? '/img/logo/IsoLogo.png'
            : '/img/logo/IsoLogoShadow.png'

    return (
        <div
            className={classNames('logo flex items-center', className)}
            style={{
                ...style,
                width: logoWidth,
            }}
        >
            <img
                src={logoSrc}
                alt="CreatIQ"
                className={classNames(
                    'object-contain',
                    type === 'full' ? 'h-10' : 'h-10',
                )}
            />
        </div>
    )
}

export default IsoLogo
