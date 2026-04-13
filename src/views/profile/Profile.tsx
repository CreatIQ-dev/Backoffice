import { useState, useEffect } from 'react'
import {
    Card,
    Button,
    Input,
    Avatar,
    Notification,
    toast,
    FormItem,
    FormContainer,
} from '@/components/ui'
import {
    HiOutlineUser,
    HiOutlineLockClosed,
    HiOutlineEnvelope,
    HiOutlineUserCircle,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineExclamationTriangle,
} from 'react-icons/hi2'
import { Dialog } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useAppSelector, useAppDispatch } from '@/store'
import {
    apiGetUserProfile,
    apiUpdateUserProfile,
    apiUpdateUserPassword,
    apiDeleteUserAccount,
} from '@/services/UserService'
import PasswordInput from '@/components/shared/PasswordInput'
import useAuth from '@/utils/hooks/useAuth'

const profileValidationSchema = Yup.object().shape({
    nombre: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
})

const passwordValidationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
        .required('New password is required')
        .min(6, 'Must be at least 6 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm new password is required'),
})

const Profile = () => {
    const { getProfile, signOut } = useAuth()
    const user = useAppSelector((state) => state.auth.user)
    const [isSocialUser, setIsSocialUser] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            const resp = await apiGetUserProfile()
            if (resp.data && resp.data.ok) {
                setIsSocialUser(
                    resp.data.usuario.google || resp.data.usuario.fromFrameio,
                )
            }
        }
        fetchProfile()
    }, [])

    const onProfileUpdate = async (values: any, { setSubmitting }: any) => {
        try {
            const resp = await apiUpdateUserProfile({
                nombre: values.nombre,
                email: values.email,
            })
            if (resp.data && resp.data.ok) {
                toast.push(
                    <Notification title="Success" type="success">
                        {resp.data.msg}
                    </Notification>,
                    { placement: 'top-center' },
                )
                await getProfile()
                setIsEditing(false)
            }
        } catch (error: any) {
            toast.push(
                <Notification title="Error" type="danger">
                    {error.response?.data?.msg || 'Error updating profile'}
                </Notification>,
                { placement: 'top-center' },
            )
        }
        setSubmitting(false)
    }

    const onPasswordUpdate = async (
        values: any,
        { resetForm, setSubmitting }: any,
    ) => {
        try {
            const resp = await apiUpdateUserPassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            })
            if (resp.data && resp.data.ok) {
                toast.push(
                    <Notification title="Success" type="success">
                        Password updated successfully
                    </Notification>,
                    { placement: 'top-center' },
                )
                resetForm()
            }
        } catch (error: any) {
            toast.push(
                <Notification title="Error" type="danger">
                    {error.response?.data?.msg || 'Error updating password'}
                </Notification>,
                { placement: 'top-center' },
            )
        }
        setSubmitting(false)
    }

    const onDeleteAccount = async () => {
        try {
            const resp = await apiDeleteUserAccount()
            if (resp.data && resp.data.ok) {
                toast.push(
                    <Notification title="Account Deleted" type="success">
                        Your account has been deleted successfully.
                    </Notification>,
                    { placement: 'top-center' },
                )
                signOut()
            }
        } catch (error: any) {
            toast.push(
                <Notification title="Error" type="danger">
                    {error.response?.data?.msg || 'Error deleting account'}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <div className="flex flex-col gap-6 md:p-6 animate-fade-in relative z-10 max-w-4xl mx-auto">
            <div className="mb-4">
                <h2 className="text-gradient mb-1">My Profile</h2>
                <p className="text-muted-foreground font-light">
                    Manage your personal information and security settings.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                    <Card className="glass-card flex flex-col items-center p-8 text-center sticky top-24">
                        <Avatar
                            size={100}
                            shape="circle"
                            src={user.avatar}
                            icon={<HiOutlineUserCircle />}
                            className="bg-primary/20 text-primary text-5xl mb-4 border-4 border-primary/10 shadow-xl shadow-primary/20"
                        />
                        <h3 className="font-bold text-white mb-1">
                            {user.userName}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            {user.email}
                        </p>

                        <div className="w-full flex flex-col gap-3 py-4 border-t border-border/50">
                            <div className="flex justify-between items-center px-4">
                                <span className="text-xs uppercase font-bold text-muted-foreground tracking-tighter">
                                    Credits
                                </span>
                                <span className="text-emerald-500 font-bold">
                                    {(
                                        user.credits ||
                                        user.creditos ||
                                        0
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center px-4">
                                <span className="text-xs uppercase font-bold text-muted-foreground tracking-tighter">
                                    Plan
                                </span>
                                <span className="text-primary font-bold">
                                    Pro Account
                                </span>
                            </div>
                        </div>

                        {isSocialUser && (
                            <div className="mt-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-400 font-medium">
                                Authenticated via{' '}
                                {user.avatar?.includes('google')
                                    ? 'Google'
                                    : 'Frame.io'}
                            </div>
                        )}
                    </Card>
                </div>

                <div className="lg:w-2/3 flex flex-col gap-6">
                    <Card className="glass-card border-none" bodyClass="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-white flex items-center gap-2">
                                <HiOutlineUser className="text-primary" />
                                Personal Information
                            </h4>
                            {!isEditing && (
                                <Button
                                    size="sm"
                                    variant="twoTone"
                                    icon={<HiOutlinePencilSquare />}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                            )}
                        </div>

                        <Formik
                            initialValues={{
                                nombre: user.userName || '',
                                email: user.email || '',
                            }}
                            validationSchema={profileValidationSchema}
                            enableReinitialize
                            onSubmit={onProfileUpdate}
                        >
                            {({ touched, errors, isSubmitting, resetForm }) => (
                                <Form>
                                    <FormContainer>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormItem
                                                label="Full Name"
                                                invalid={
                                                    (errors.nombre &&
                                                        touched.nombre) as boolean
                                                }
                                                errorMessage={errors.nombre}
                                            >
                                                <Field
                                                    type="text"
                                                    name="nombre"
                                                    placeholder="Your name"
                                                    component={Input}
                                                    prefix={
                                                        <HiOutlineUser className="text-lg" />
                                                    }
                                                    disabled={!isEditing}
                                                />
                                            </FormItem>
                                            <FormItem
                                                label="Email Address"
                                                invalid={
                                                    (errors.email &&
                                                        touched.email) as boolean
                                                }
                                                errorMessage={errors.email}
                                            >
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    placeholder="your@email.com"
                                                    component={Input}
                                                    prefix={
                                                        <HiOutlineEnvelope className="text-lg" />
                                                    }
                                                    disabled={
                                                        !isEditing ||
                                                        isSocialUser
                                                    }
                                                />
                                            </FormItem>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end mt-6 gap-2">
                                                <Button
                                                    size="sm"
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false)
                                                        resetForm()
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    loading={isSubmitting}
                                                    variant="solid"
                                                    type="submit"
                                                >
                                                    Save Changes
                                                </Button>
                                            </div>
                                        )}
                                    </FormContainer>
                                </Form>
                            )}
                        </Formik>
                    </Card>

                    {!isSocialUser && (
                        <Card
                            className="glass-card border-none"
                            bodyClass="p-6"
                        >
                            <h4 className="mb-6 text-white flex items-center gap-2">
                                <HiOutlineLockClosed className="text-primary" />
                                Security
                            </h4>

                            <Formik
                                initialValues={{
                                    oldPassword: '',
                                    newPassword: '',
                                    confirmPassword: '',
                                }}
                                validationSchema={passwordValidationSchema}
                                onSubmit={onPasswordUpdate}
                            >
                                {({ touched, errors, isSubmitting }) => (
                                    <Form>
                                        <FormContainer>
                                            <FormItem
                                                label="Current Password"
                                                invalid={
                                                    (errors.oldPassword &&
                                                        touched.oldPassword) as boolean
                                                }
                                                errorMessage={
                                                    errors.oldPassword
                                                }
                                            >
                                                <Field
                                                    name="oldPassword"
                                                    placeholder="Current password"
                                                    component={PasswordInput}
                                                />
                                            </FormItem>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                                <FormItem
                                                    label="New Password"
                                                    invalid={
                                                        (errors.newPassword &&
                                                            touched.newPassword) as boolean
                                                    }
                                                    errorMessage={
                                                        errors.newPassword
                                                    }
                                                >
                                                    <Field
                                                        name="newPassword"
                                                        placeholder="Min 6 characters"
                                                        component={
                                                            PasswordInput
                                                        }
                                                    />
                                                </FormItem>
                                                <FormItem
                                                    label="Confirm New Password"
                                                    invalid={
                                                        (errors.confirmPassword &&
                                                            touched.confirmPassword) as boolean
                                                    }
                                                    errorMessage={
                                                        errors.confirmPassword
                                                    }
                                                >
                                                    <Field
                                                        name="confirmPassword"
                                                        placeholder="Repeat new password"
                                                        component={
                                                            PasswordInput
                                                        }
                                                    />
                                                </FormItem>
                                            </div>

                                            <div className="flex justify-end mt-6">
                                                <Button
                                                    size="sm"
                                                    loading={isSubmitting}
                                                    variant="solid"
                                                    type="submit"
                                                >
                                                    Update Password
                                                </Button>
                                            </div>
                                        </FormContainer>
                                    </Form>
                                )}
                            </Formik>
                        </Card>
                    )}
                    <Card
                        className="border-red-500/20 bg-red-500/5"
                        bodyClass="p-6"
                    >
                        <h4 className="mb-4 text-red-500 flex items-center gap-2">
                            <HiOutlineExclamationTriangle />
                            Danger Zone
                        </h4>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h5 className="text-white text-sm font-bold mb-1">
                                    Delete Account
                                </h5>
                                <p className="text-xs text-muted-foreground">
                                    Once you delete your account, there is no
                                    going back. Please be certain.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                className="bg-red-500 hover:bg-red-600 border-none text-white font-bold"
                                icon={<HiOutlineTrash />}
                                onClick={() => setIsDeleteOpen(true)}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            <Dialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onRequestClose={() => setIsDeleteOpen(false)}
                contentClassName="mt-60"
            >
                <div className="flex flex-col gap-4">
                    <h5 className="text-red-500 flex items-center gap-2">
                        <HiOutlineExclamationTriangle />
                        Delete Account Permanently
                    </h5>
                    <p className="text-sm text-muted-foreground">
                        This action <b>cannot</b> be undone. This will
                        permanently delete your account and all associated data.
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                        Please type <span className="text-white">delete</span>{' '}
                        to confirm:
                    </p>
                    <Input
                        placeholder='Type "delete"'
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <Button
                            size="sm"
                            onClick={() => {
                                setIsDeleteOpen(false)
                                setDeleteConfirm('')
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 border-none text-white font-bold"
                            disabled={deleteConfirm !== 'delete'}
                            onClick={onDeleteAccount}
                        >
                            Permanently Delete
                        </Button>
                    </div>
                </div>
            </Dialog>

            <div className="mt-12 text-center text-muted-foreground/30 text-[10px] font-light tracking-widest uppercase">
                Your data is protected with military-grade encryption.
            </div>
        </div>
    )
}

export default Profile
