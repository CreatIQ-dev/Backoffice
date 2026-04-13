import SignUpForm from './SignUpForm'

const SignUp = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Sign Up</h3>
                <p>Please enter your details to register</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </>
    )
}

export default SignUp
