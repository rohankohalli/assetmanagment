import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import Select from '../components/Select.jsx'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function EditAsset() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [type, setType] = useState('laptop')
    const [assetTag, setAssetTag] = useState('')
    const [serialNumber, setSerialNumber] = useState('')
    const [status, setStatus] = useState('available')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const loadAsset = useCallback(async () => {
        try {
            const data = await api(`/assets/${id}`)
            setName(data.name)
            setType(data.type)
            setAssetTag(data.asset_tag)
            setSerialNumber(data.serial_number)
            setStatus(data.status)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        loadAsset()
    }, [loadAsset])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await api(`/assets/${id}`, 'PUT', {
                name,
                type,
                asset_tag: assetTag,
                serial_number: serialNumber,
                status
            })
            toast.success('Asset updated successfully!')
            navigate(`/assets/${id}`)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Loading asset...</div>

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button
                onClick={() => navigate(`/assets/${id}`)}
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 border-b pb-4 mb-6">Edit Asset</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Asset Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Asset Tag"
                            required
                            value={assetTag}
                            onChange={(e) => setAssetTag(e.target.value)}
                        />
                        <Input
                            label="Serial Number"
                            required
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label="Device Type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            options={[
                                { value: 'laptop', label: 'Laptop' },
                                { value: 'monitor', label: 'Monitor' },
                                { value: 'phone', label: 'Phone' },
                                { value: 'other', label: 'Other Peripheral' }
                            ]}
                        />
                        <Select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            options={[
                                { value: 'available', label: 'Available' },
                                { value: 'assigned', label: 'Assigned' },
                                { value: 'under_repair', label: 'Under Repair' }
                            ]}
                        />
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-3">
                        <Button variant="outline" onClick={() => navigate(`/assets/${id}`)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={saving}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}