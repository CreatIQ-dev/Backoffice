import { useAppSelector } from '@/store'

const Home = () => {
    const { userName } = useAppSelector(
        (state) => state.auth.user,
    )

    return (
        <div className="flex flex-col gap-8 md:p-6 animate-fade-in relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="mb-2 text-gradient">
                        Welcome back, {userName || 'User'}
                    </h1>
                    <p className="text-muted-foreground max-w-[600px] font-light">
                        This is your dashboard shell. You can start building your application here.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="glass-card p-8 border-dashed border-2 border-border/50 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <h3 className="text-muted-foreground/50 mb-2">Empty State</h3>
                    <p className="text-muted-foreground/30">Select a menu item or add new content here.</p>
                </div>
            </div>

            <div className="text-center text-muted-foreground/40 text-[10px] font-light mt-8 tracking-widest uppercase">
                © {new Date().getFullYear()} Dashboard Shell
            </div>
        </div>
    )
}

export default Home
