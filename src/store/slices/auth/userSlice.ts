import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    avatar?: string
    userName?: string
    email?: string
    authority?: string[]
    invites?: string[]
    tokens?: number
    creditos?: number
    credits?: number
    onboardingSeen?: boolean
    pluginVersion?: string
}
const initialState: UserState = {
    avatar: '',
    userName: '',
    email: '',
    authority: [],
    invites: [],
    creditos: 0,
    credits: 0,
    onboardingSeen: false,
    pluginVersion: undefined,
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.avatar = action.payload?.avatar
            state.email = action.payload?.email
            state.userName = action.payload?.userName
            state.authority = action.payload?.authority
            state.invites = action.payload?.invites
            state.tokens = action.payload?.tokens
            state.creditos = action.payload?.creditos ?? action.payload?.credits
            state.credits = action.payload?.credits ?? action.payload?.creditos
            state.onboardingSeen = action.payload?.onboardingSeen
            state.pluginVersion = action.payload?.pluginVersion
        },
        setCredits(state, action: PayloadAction<number>) {
            state.credits = action.payload
            state.creditos = action.payload
        },
    },
})

export const { setUser, setCredits } = userSlice.actions
export default userSlice.reducer
