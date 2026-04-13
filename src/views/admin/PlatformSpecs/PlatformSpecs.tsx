import { useState, useEffect } from 'react'
import { 
    Card, 
    Button, 
    Table, 
    Dialog, 
    Input, 
    FormItem, 
    FormContainer, 
    Notification, 
    toast, 
    Spinner,
    Checkbox
} from '@/components/ui'
import { apiGetPlatformSpecs, apiUpdatePlatformSpec, Spec } from '@/services/SpecsService'
import { HiOutlinePencil, HiOutlineRefresh } from 'react-icons/hi'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'

const { Tr, Th, Td, THead, TBody } = Table

const validationSchema = Yup.object().shape({
    key: Yup.string().required('Key is required'),
    name: Yup.string().required('Name is required'),
})

const PlatformSpecs = () => {
    const [specs, setSpecs] = useState<Spec[]>([])
    const [loading, setLoading] = useState(true)
    const [editingSpec, setEditingSpec] = useState<Spec | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const fetchSpecs = async () => {
        setLoading(true)
        try {
            const resp = await apiGetPlatformSpecs()
            if (resp.data.ok && Array.isArray(resp.data.specs)) {
                setSpecs(resp.data.specs)
            } else if (Array.isArray(resp.data)) {
                setSpecs(resp.data)
            } else if (resp.data.specs && Array.isArray(resp.data.specs)) {
                setSpecs(resp.data.specs)
            }
        } catch (error) {
            console.error('Failed to fetch specs', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSpecs()
    }, [])

    const onEditClick = (spec: Spec) => {
        setEditingSpec(spec)
        setIsDialogOpen(true)
    }

    const onDialogClose = () => {
        setIsDialogOpen(false)
        setEditingSpec(null)
    }

    const onSubmit = async (values: any, { setSubmitting }: any) => {
        if (!editingSpec) return
        
        const id = editingSpec._id || editingSpec.id
        
        if (!id) {
            toast.push(
                <Notification title="Error" type="danger">
                    Missing specification ID
                </Notification>,
                { placement: 'top-center' }
            )
            setSubmitting(false)
            return
        }

        const payload = {
            ...values,
            supportedAspects: typeof values.supportedAspects === 'string' ? values.supportedAspects.split(',').map((s: string) => s.trim()).filter((s: string) => s) : values.supportedAspects,
            fileFormats: typeof values.fileFormats === 'string' ? values.fileFormats.split(',').map((s: string) => s.trim()).filter((s: string) => s) : values.fileFormats,
            audioCodecs: typeof values.audioCodecs === 'string' ? values.audioCodecs.split(',').map((s: string) => s.trim()).filter((s: string) => s) : values.audioCodecs,
            tips: typeof values.tips === 'string' ? values.tips.split(',').map((s: string) => s.trim()).filter((s: string) => s) : values.tips,
        }

        try {
            const resp = await apiUpdatePlatformSpec(id, payload)
            if (resp.data.ok || resp.status === 200) {
                toast.push(
                    <Notification title="Success" type="success">
                        Platform updated successfully
                    </Notification>,
                    { placement: 'top-center' }
                )
                fetchSpecs()
                onDialogClose()
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Failed to update</Notification>, { placement: 'top-center' })
        }
        setSubmitting(false)
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold">Platform Specs</h3>
                <Button 
                    size="sm" 
                    variant="twoTone" 
                    icon={<HiOutlineRefresh />} 
                    onClick={fetchSpecs} 
                    loading={loading}
                >
                    Refresh
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                {loading ? (
                    <div className="flex justify-center py-10"><Spinner size={30} /></div>
                ) : (
                    <Table>
                        <THead>
                            <Tr>
                                <Th>Name / Key</Th>
                                <Th>Resolution (Rec)</Th>
                                <Th>Primary Aspect</Th>
                                <Th>Duration (s)</Th>
                                <Th className="text-center">Broadcast</Th>
                                <Th></Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {specs.length > 0 ? (
                                specs.map((spec) => (
                                    <Tr key={spec._id}>
                                        <Td>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 dark:text-gray-200">{spec.name}</span>
                                                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">{spec.key}</span>
                                            </div>
                                        </Td>
                                        <Td>
                                            {spec.recWidth && spec.recHeight ? `${spec.recWidth}x${spec.recHeight}` : '-'}
                                        </Td>
                                        <Td>{spec.primaryAspect || '-'}</Td>
                                        <Td>
                                            {spec.minDuration || spec.maxDuration ? `${spec.minDuration ?? 0}s - ${spec.maxDuration ?? '∞'}s` : '-'}
                                        </Td>
                                        <Td className="text-center">
                                            {spec.isBroadcast ? (
                                                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">YES</span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded">NO</span>
                                            )}
                                        </Td>
                                        <Td className="text-right">
                                            <Button
                                                size="xs"
                                                icon={<HiOutlinePencil />}
                                                onClick={() => onEditClick(spec)}
                                            >
                                                Edit
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan={6} className="text-center py-10 text-gray-400 italic">
                                        No platforms found
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                )}
            </Card>

            <Dialog
                isOpen={isDialogOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                width={800}
            >
                <div className="p-6 h-[85vh] flex flex-col overflow-hidden">
                    <h5 className="mb-6">Edit Specifications: {editingSpec?.name}</h5>
                    
                    <Formik
                        initialValues={{
                            key: editingSpec?.key || '',
                            name: editingSpec?.name || '',
                            isBroadcast: editingSpec?.isBroadcast || false,
                            minWidth: editingSpec?.minWidth || '',
                            minHeight: editingSpec?.minHeight || '',
                            recWidth: editingSpec?.recWidth || '',
                            recHeight: editingSpec?.recHeight || '',
                            primaryAspect: editingSpec?.primaryAspect || '',
                            primaryAspectValue: editingSpec?.primaryAspectValue || '',
                            supportedAspects: editingSpec?.supportedAspects?.join(', ') || '',
                            minDuration: editingSpec?.minDuration || '',
                            maxDuration: editingSpec?.maxDuration || '',
                            optimalDurationMin: editingSpec?.optimalDurationMin || '',
                            optimalDurationMax: editingSpec?.optimalDurationMax || '',
                            durationNotes: editingSpec?.durationNotes || '',
                            fileFormats: editingSpec?.fileFormats?.join(', ') || '',
                            maxFileSizeMb: editingSpec?.maxFileSizeMb || '',
                            minFps: editingSpec?.minFps || '',
                            maxFps: editingSpec?.maxFps || '',
                            recFps: editingSpec?.recFps || '',
                            audioCodecs: editingSpec?.audioCodecs?.join(', ') || '',
                            audioSampleRate: editingSpec?.audioSampleRate || '',
                            tips: editingSpec?.tips?.join(', ') || '',
                            safeZone: {
                                top: editingSpec?.safeZone?.top || '',
                                bottom: editingSpec?.safeZone?.bottom || '',
                                left: editingSpec?.safeZone?.left || '',
                                right: editingSpec?.safeZone?.right || '',
                                notes: editingSpec?.safeZone?.notes || '',
                            }
                        }}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ values, touched, errors, isSubmitting, setFieldValue }) => (
                            <Form className="flex-1 overflow-auto pr-2 custom-scrollbar">
                                <FormContainer>
                                    <div className="space-y-8">
                                        {/* General Section */}
                                        <section>
                                            <h6 className="text-xs font-bold uppercase text-blue-600 mb-4 tracking-wider">General Information</h6>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormItem label="Key (ID)" invalid={errors.key && touched.key} errorMessage={errors.key}>
                                                    <Field name="key" component={Input} disabled />
                                                </FormItem>
                                                <FormItem label="Name" invalid={errors.name && touched.name} errorMessage={errors.name}>
                                                    <Field name="name" component={Input} />
                                                </FormItem>
                                                <FormItem label="Broadcast?">
                                                    <Field name="isBroadcast">
                                                        {({ field, form }: any) => (
                                                            <Checkbox 
                                                                checked={field.value} 
                                                                onChange={(val) => form.setFieldValue(field.name, val)} 
                                                            >
                                                                Is for broadcast?
                                                            </Checkbox>
                                                        )}
                                                    </Field>
                                                </FormItem>
                                            </div>
                                        </section>

                                        {/* Dimensions Section */}
                                        <section>
                                            <h6 className="text-xs font-bold uppercase text-blue-600 mb-4 tracking-wider">Dimensions & Aspect Ratio</h6>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormItem label="Min Width (px)">
                                                    <Field name="minWidth" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Min Height (px)">
                                                    <Field name="minHeight" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Rec. Width (px)">
                                                    <Field name="recWidth" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Rec. Height (px)">
                                                    <Field name="recHeight" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Primary Aspect">
                                                    <Field name="primaryAspect" component={Input} placeholder="Ex: 16:9" />
                                                </FormItem>
                                                <FormItem label="Aspect Value (Numeric)">
                                                    <Field name="primaryAspectValue" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Supported Aspects" className="col-span-2">
                                                    <Field name="supportedAspects" component={Input} placeholder="Ex: 16:9, 9:16, 4:5" />
                                                </FormItem>
                                            </div>
                                        </section>

                                        {/* Video & Audio Section */}
                                        <section>
                                            <h6 className="text-xs font-bold uppercase text-blue-600 mb-4 tracking-wider">Video & Audio Settings</h6>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormItem label="Min Duration (s)">
                                                    <Field name="minDuration" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Max Duration (s)">
                                                    <Field name="maxDuration" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Optimal Min (s)">
                                                    <Field name="optimalDurationMin" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Optimal Max (s)">
                                                    <Field name="optimalDurationMax" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Min FPS">
                                                    <Field name="minFps" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Max FPS">
                                                    <Field name="maxFps" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Rec. FPS">
                                                    <Field name="recFps" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Audio Sample Rate (Hz)">
                                                    <Field name="audioSampleRate" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="File Formats" className="col-span-2">
                                                    <Field name="fileFormats" component={Input} placeholder="mp4, mov, avi" />
                                                </FormItem>
                                                <FormItem label="Audio Codecs" className="col-span-2">
                                                    <Field name="audioCodecs" component={Input} placeholder="aac, mp3" />
                                                </FormItem>
                                            </div>
                                        </section>

                                        {/* Extras & Safe Zone Section */}
                                        <section>
                                            <h6 className="text-xs font-bold uppercase text-blue-600 mb-4 tracking-wider">Extra Information & Safe Zone</h6>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormItem label="Max File Size (Mb)">
                                                    <Field name="maxFileSizeMb" type="number" component={Input} />
                                                </FormItem>
                                                <FormItem label="Duration Notes" className="col-span-2">
                                                    <Field name="durationNotes" textArea component={Input} />
                                                </FormItem>
                                                <FormItem label="Tips" className="col-span-2">
                                                    <Field name="tips" textArea component={Input} />
                                                </FormItem>
                                                
                                                <div className="col-span-2 border-t border-gray-100 dark:border-gray-800 pt-6 mt-4">
                                                    <div className="grid grid-cols-4 gap-4">
                                                        <FormItem label="Safe Top %">
                                                            <Field name="safeZone.top" type="number" component={Input} />
                                                        </FormItem>
                                                        <FormItem label="Safe Bottom %">
                                                            <Field name="safeZone.bottom" type="number" component={Input} />
                                                        </FormItem>
                                                        <FormItem label="Safe Left %">
                                                            <Field name="safeZone.left" type="number" component={Input} />
                                                        </FormItem>
                                                        <FormItem label="Safe Right %">
                                                            <Field name="safeZone.right" type="number" component={Input} />
                                                        </FormItem>
                                                    </div>
                                                    <FormItem label="Safe Zone Notes">
                                                        <Field name="safeZone.notes" textArea component={Input} />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-8 pb-10">
                                        <Button type="button" onClick={onDialogClose}>Cancel</Button>
                                        <Button
                                            variant="solid"
                                            type="submit"
                                            loading={isSubmitting}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            Update Specification
                                        </Button>
                                    </div>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Dialog>
        </div>
    )
}

export default PlatformSpecs
