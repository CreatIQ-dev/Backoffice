import { useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogout } from 'react-icons/hi'
import { HiOutlineUser, HiOutlineBanknotes } from 'react-icons/hi2'
import type { CommonProps } from '@/@types/common'
import { useAppSelector } from '@/store'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    {
        label: 'My Profile',
        path: '/profile',
        icon: <HiOutlineUser />,
    },
]

const _UserDropdown = ({ className }: CommonProps) => {
    const { signOut, getProfile } = useAuth()
    const {
        userName: reduxName,
        email: reduxEmail,
        authority,
    } = useAppSelector((state) => state.auth.user)

    useEffect(() => {
        getProfile()
    }, [])

    const storedAuthInfo =
        localStorage.getItem('user') || localStorage.getItem('auth')
    const authInfo = storedAuthInfo ? JSON.parse(storedAuthInfo) : null
    const user = authInfo?.user || authInfo

    const userName = reduxName || user?.nombre || user?.name || 'User'
    const userLastName = user?.apellido || ''
    const userEmail = reduxEmail || user?.email || ''
    const userRole = authority?.join(', ') || user?.role || 'ADMIN'

    const UserAvatar = (
        <div
            className={classNames(
                className,
                'flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-card/60 backdrop-blur-md cursor-pointer transition-all header-action-item border-muted header-action-item-hoverable',
            )}
        >
            <Avatar
                size={32}
                shape="circle"
                icon={<HiOutlineUser />}
                className="bg-primary/20 text-primary"
            />
            <div className="hidden md:block pr-1 text-left">
                <div className="font-semibold text-white text-xs leading-tight">
                    {userName}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    {userRole}
                </div>
            </div>
        </div>
    )

    return (
        <div>
            <Dropdown
                menuStyle={{
                    minWidth: 260,
                    borderRadius: '1.5rem',
                    marginTop: 8,
                    padding: '0.5rem',
                    background: 'hsl(240 25% 12% / 0.95)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid hsl(240 15% 20%)',
                }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="py-3 px-4 flex items-center gap-3">
                        <Avatar
                            shape="circle"
                            size={40}
                            icon={<HiOutlineUser />}
                            className="bg-primary/20 text-primary"
                        />
                        <div>
                            <div className="font-semibold text-white text-sm">
                                {userName + ' ' + userLastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {userEmail}
                            </div>
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item
                    variant="divider"
                    className="my-1 border-border/50"
                />
                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-1 rounded-xl hover:bg-white/5"
                    >
                        <Link
                            className="flex h-full w-full px-3 py-2"
                            to={item.path}
                        >
                            <span className="flex gap-3 items-center w-full">
                                <span className="text-lg text-muted-foreground group-hover:text-primary transition-colors">
                                    {item.icon}
                                </span>
                                <span className="text-sm font-light text-white/80 group-hover:text-white transition-colors">
                                    {item.label}
                                </span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))}
                <Dropdown.Item
                    variant="divider"
                    className="my-1 border-border/50"
                />
                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-3 px-4 py-3 rounded-xl hover:bg-red-500/5 transition-colors"
                    onClick={signOut}
                >
                    <span className="text-lg text-red-500">
                        <HiOutlineLogout />
                    </span>
                    <span className="text-sm font-semibold text-red-500">
                        Sign Out
                    </span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
