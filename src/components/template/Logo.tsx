import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
}

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    const logoSrc =
        type === 'full'
            ? '/img/logo/LogoShadow.png'
            : '/img/logo/IsoLogoShadow.png'

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                width: logoWidth,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <img
                className={classNames('object-contain', imgClass)}
                src={logoSrc}
                alt={`${APP_NAME} logo`}
                style={{ height: '32px' }}
            />
        </div>
    )
}

export default Logo
