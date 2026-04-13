import { cloneElement } from 'react'
import type { CommonProps } from '@/@types/common'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    return (
        <div
            className="grid lg:grid-cols-2 h-screen overflow-hidden relative z-10"
            style={{
                background:
                    'linear-gradient(135deg, #6b21a8 0%, #1e1b4b 40%, #030712 100%)',
            }}
        >
            <div className="hidden lg:flex flex-col relative overflow-hidden">
                <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                    <img
                        src="/img/logo/IsoLogoShadow.png"
                        alt="CreatIQ"
                        className="w-fit object-contain"
                        style={{ width: '250px' }}
                    />

                    <div className="flex-1 flex items-center justify-center py-8">
                        <img
                            src="/img/others/Login-Side.png"
                            alt="Login Visual"
                            className="max-h-[90%] w-auto object-contain drop-shadow-2xl"
                        />
                    </div>

                    <div>
                        <h1 className="text-white text-4xl font-semibold mb-4 leading-tight">
                            Your eyes are tired. Ours aren't.
                        </h1>
                        <p className="text-white text-lg font-light max-w-md opacity-80">
                            Catch every spec error before your client. <br />{' '}
                            Automated video QC, inside Frame.io.
                        </p>
                    </div>
                </div>
            </div>

            <div className="col-span-1 flex flex-col justify-center items-center bg-transparent backdrop-blur-sm lg:backdrop-blur-none">
                <div className="xl:min-w-[450px] px-8 py-12 glass-card lg:bg-transparent lg:border-none lg:backdrop-blur-none">
                    <div className="mb-10 text-center lg:text-left">
                        {content}
                    </div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
