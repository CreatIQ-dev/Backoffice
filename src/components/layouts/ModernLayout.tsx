import Header from '@/components/template/Header'
import SidePanel from '@/components/template/SidePanel/SidePanel'
import UserDropdown from '@/components/template/UserDropdown'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import View from '@/views'
import { HiOutlineEnvelope, HiOutlineBell } from 'react-icons/hi2'

const HeaderActionsStart = () => {
    return (
        <div className="flex items-center gap-4">
            <MobileNav />
        </div>
    )
}

const HeaderActionsEnd = () => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <button className="header-action-item border-muted header-action-item-hoverable">
                    <HiOutlineEnvelope className="text-xl" />
                </button>
                <button className="header-action-item border-muted header-action-item-hoverable">
                    <HiOutlineBell className="text-xl" />
                </button>
                <UserDropdown hoverable={false} />
            </div>
        </div>
    )
}

const ModernLayout = () => {
    return (
        <div className="app-layout-modern flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-transparent">
                    <Header
                        className="bg-transparent"
                        headerEnd={<HeaderActionsEnd />}
                        headerStart={<HeaderActionsStart />}
                    />
                    <View />
                </div>
            </div>
        </div>
    )
}

export default ModernLayout
