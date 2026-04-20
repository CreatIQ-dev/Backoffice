import ApiService from './ApiService'

export type SafeZone = {
    top?: number
    bottom?: number
    left?: number
    right?: number
    notes?: string
}

export type Spec = {
    _id: string
    id?: string
    key: string
    name: string
    minWidth?: number
    minHeight?: number
    recWidth?: number
    recHeight?: number
    primaryAspect?: string
    primaryAspectValue?: number
    supportedAspects?: string[]
    minDuration?: number
    maxDuration?: number
    optimalDurationMin?: number
    optimalDurationMax?: number
    durationNotes?: string
    fileFormats?: string[]
    maxFileSizeMb?: number
    minFps?: number
    maxFps?: number
    recFps?: number
    audioCodecs?: string[]
    audioSampleRate?: number
    safeZone?: SafeZone
    tips?: string[]
    isBroadcast?: boolean
    updatedAt?: string
    createdAt?: string
}

export async function apiGetPlatformSpecs() {
    return ApiService.fetchData<{ ok: boolean; specs: Spec[] }>({
        url: '/api/platform-specs',
        method: 'get',
    })
}

export async function apiUpdatePlatformSpec(id: string, data: Partial<Spec>) {
    return ApiService.fetchData<{ ok: boolean; spec: Spec }>({
        url: `/api/platform-specs/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreatePlatformSpec(data: Partial<Spec>) {
    return ApiService.fetchData<{ ok: boolean; spec: Spec }>({
        url: `/api/platform-specs`,
        method: 'post',
        data,
    })
}

export async function apiDeletePlatformSpec(id: string) {
    return ApiService.fetchData<{ ok: boolean; msg?: string }>({
        url: `/api/platform-specs/${id}`,
        method: 'delete',
    })
}
