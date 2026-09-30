import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import Button from '../components/Button.jsx'
import Select from '../components/Select.jsx'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function NewAssignment() {
    const navigate = useNavigate()
    const [availableAssets, setAvailableAssets] = useState([])
    const [staffList, setStaffList] = useState([])
    const [selectedAsset, setSelectedAsset] = useState('')
    const [selectedStaff, setSelectedStaff] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const loadDropdownData = async () => {
        try {
            setLoading(true)
            const [assets, staff] = await Promise.all([
                api('/assets?status=available'),
                api('/staff')
            ])
            setAvailableAssets(assets)
            setStaffList(staff)

            if (assets.length > 0) setSelectedAsset(assets[0].id)
            if (staff.length > 0) setSelectedStaff(staff[0].id)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDropdownData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await api('/assigned-assets/assign', 'POST', {
                asset_id: selectedAsset,
                staff_id: selectedStaff
            })
            toast.success('Equipment checked out successfully!')
            navigate('/assignments')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Loading available equipment...</div>

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/assignments')}
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Assignments
            </button>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 border-b pb-4 mb-6">Assign Equipment</h1>

                {availableAssets.length === 0 ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg text-center font-medium">
                        ⚠️ No equipment is currently Available in storage. Add or return an asset first.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Select
                            label="Select Available Asset"
                            required
                            value={selectedAsset}
                            onChange={(e) => setSelectedAsset(e.target.value)}
                            options={availableAssets.map(a => ({
                                value: a.id,
                                label: `${a.name} (${a.asset_tag} - ${a.type})`
                            }))}
                        />

                        <Select
                            label="Assign to Staff Member"
                            required
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                            options={staffList.map(s => ({
                                value: s.id,
                                label: `${s.name} (${s.department})`
                            }))}
                        />

                        <div className="pt-4 border-t flex justify-end gap-3">
                            <Button variant="outline" onClick={() => navigate('/assignments')}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="accent" loading={submitting}>
                                Complete Assignment
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}