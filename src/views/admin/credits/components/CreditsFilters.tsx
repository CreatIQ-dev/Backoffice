import { Select, DatePicker, Input } from '@/components/ui'
import { HiOutlineAdjustmentsHorizontal, HiOutlineTag } from 'react-icons/hi2'
import { HiOutlineSearch } from 'react-icons/hi'

const { DatePickerRange } = DatePicker

const checkTypes = [
    { label: 'All Checks', value: '' },
    { label: 'Resolution', value: 'resolution' },
    { label: 'Audio Levels', value: 'audio' },
    { label: 'Safe Zone', value: 'safe_zone' },
    { label: 'Black Frames', value: 'black_frames' },
    { label: 'Duplicate Frames', value: 'duplicate_frames' },
    { label: 'Text Readability', value: 'caption_readability' },
]

const CreditsFilters = ({ filters, onFilterChange }: any) => {

    const handleDateChange = (val: [Date | null, Date | null]) => {
        onFilterChange({
            ...filters,
            startDate: val[0],
            endDate: val[1]
        })
    }

    const handleCheckTypeChange = (val: any) => {
        onFilterChange({
            ...filters,
            checkType: val?.value || ''
        })
    }

    const handleUserChange = (e: any) => {
        onFilterChange({
            ...filters,
            userId: e.target.value
        })
    }

    return (
        <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl backdrop-blur-xl border border-white/5">
            
            <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <HiOutlineAdjustmentsHorizontal />
                </div>
                <div className="w-[240px]">
                    <DatePickerRange
                        placeholder="Select Period"
                        size="sm"
                        value={[filters.startDate, filters.endDate]}
                        onChange={handleDateChange}
                        className="bg-transparent border-none focus:ring-1 focus:ring-indigo-500/50 rounded-xl"
                    />
                </div>
            </div>

            <div className="h-6 w-px bg-white/10 mx-1" />

            <div className="flex items-center gap-2 group min-w-[180px]">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <HiOutlineTag />
                </div>
                <Select
                    className="w-full"
                    size="sm"
                    options={checkTypes}
                    value={checkTypes.find(c => c.value === filters.checkType)}
                    onChange={handleCheckTypeChange}
                    styles={{
                        menu: (base: any) => ({
                            ...base,
                            backgroundColor: '#1a1c2e', 
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            zIndex: 100
                        }),
                        option: (base: any, state: any) => ({
                            ...base,
                            backgroundColor: state.isFocused ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                            color: 'white',
                            '&:active': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        })
                    }}
                    components={{
                        Control: (props: any) => (
                            <div {...props.innerProps} className="bg-transparent border-none text-[10px] font-black uppercase text-white cursor-pointer py-1.5 flex items-center gap-2">
                                {props.children}
                            </div>
                        )
                    }}
                />
            </div>

        </div>
    )
}

export default CreditsFilters
