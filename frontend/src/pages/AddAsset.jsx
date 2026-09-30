import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import Select from '../components/Select.jsx'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function AddAsset() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [type, setType] = useState('laptop')
    const [assetTag, setAssetTag] = useState('')
    const [serialNumber, setSerialNumber] = useState('')
    const [status, setStatus] = useState('available')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api('/assets', 'POST', {
                name,
                type,
                asset_tag: assetTag,
                serial_number: serialNumber,
                status
            })
            toast.success('Asset created successfully!')
            navigate('/assets')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/assets')}
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Assets
            </button>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 border-b pb-4 mb-6">Add New Asset</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Asset Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dell Latitude 5440"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Asset Tag (Unique)"
                            required
                            value={assetTag}
                            onChange={(e) => setAssetTag(e.target.value)}
                            placeholder="HAR-LP-101"
                        />
                        <Input
                            label="Serial Number"
                            required
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                            placeholder="SN-98213-X"
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
                            label="Initial Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            options={[
                                { value: 'available', label: 'Available (In Storage)' },
                                { value: 'under_repair', label: 'Under Repair' }
                            ]}
                        />
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-3">
                        <Button variant="outline" onClick={() => navigate('/assets')}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={loading}>
                            Save Asset
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}