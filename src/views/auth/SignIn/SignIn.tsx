import React from 'react'
import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="text-white mb-1 text-center">Welcome back!</h3>
                <p className="text-center">
                    Please enter your credentials to login!
                </p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
