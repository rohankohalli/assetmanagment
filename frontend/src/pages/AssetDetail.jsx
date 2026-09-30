import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client.js'
import StatusBadge from '../components/StatusBadge.jsx'
import Button from '../components/Button.jsx'
import toast from 'react-hot-toast'
import { ArrowLeft, User, RotateCcw, Clock, Laptop, ShieldCheck, Calendar, X } from 'lucide-react'

export default function AssetDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [asset, setAsset] = useState(null)
    const [loading, setLoading] = useState(true)
    const [returnModal, setReturnModal] = useState(false)
    const [returnStatus, setReturnStatus] = useState('available')
    const [submitting, setSubmitting] = useState(false)

    const loadAsset = useCallback(async () => {
        try {
            const data = await api(`/assets/${id}`)
            setAsset(data)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        let isMounted = true
        api(`/assets/${id}`)
            .then((data) => {
                if (isMounted) setAsset(data)
            })
            .catch((err) => {
                if (isMounted) toast.error(err.message)
            })
            .finally(() => {
                if (isMounted) setLoading(false)
            })
        return () => {
            isMounted = false
        }
    }, [id])

    const handleReturn = async () => {
        try {
            setSubmitting(true)
            await api(`/assigned-assets/return/${id}`, 'POST', {
                return_status: returnStatus
            })
            toast.success('Asset returned to inventory!')
            setReturnModal(false)
            loadAsset()
        } catch (err) {
            toast.error('Failed to return asset: ' + err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-500 font-medium">Loading asset audit trail...</div>
    if (!asset) return <div className="p-12 text-center text-red-600 font-medium">Asset not found.</div>

    const activeAssignment = asset.assignments?.find(a => a.status === 'assigned')

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/assets')}
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Assets Inventory
            </button>

            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3.5 bg-blue-50 text-[#1B3C73] rounded-xl border border-blue-100 shrink-0">
                        <Laptop className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{asset.name}</h1>
                            <StatusBadge status={asset.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5 font-mono">
                            <span>Tag: <strong className="text-[#1B3C73]">{asset.asset_tag}</strong></span>
                            <span>•</span>
                            <span>SN: {asset.serial_number}</span>
                            <span>•</span>
                            <span className="capitalize">{asset.type}</span>
                        </div>
                    </div>
                </div>

                <Button variant="outline" onClick={() => navigate(`/assets/${asset.id}/edit`)}>
                    Edit Asset
                </Button>
            </div>

            {activeAssignment ? (
                <div className="bg-linear-to-r from-blue-50/70 to-indigo-50/40 p-6 rounded-xl border border-blue-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-[#1B3C73] text-white rounded-full mt-0.5 shadow-sm">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B3C73] bg-blue-100/80 px-2 py-0.5 rounded">
                                Current Custody
                            </span>
                            <h3 className="font-bold text-slate-900 text-base mt-1">{activeAssignment.staff?.name}</h3>
                            <p className="text-xs text-slate-600">
                                {activeAssignment.staff?.department} • {activeAssignment.staff?.email}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                Checked out on: <span className="font-medium text-slate-700">{new Date(activeAssignment.assigned_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2.5">
                        <Button variant="accent" onClick={() => setReturnModal(true)}>
                            <RotateCcw className="w-4 h-4 mr-1.5" /> Return Asset
                        </Button>
                        <Link
                            to={`/staff/${activeAssignment.staff_id}`}
                            className="text-xs font-semibold text-[#1B3C73] hover:underline"
                        >
                            View Staff Profile →
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <div>
                            <h4 className="text-sm font-bold">In Storage & Available</h4>
                            <p className="text-xs text-emerald-700">This asset is ready to be assigned to another staff member.</p>
                        </div>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/assignments/new')}>
                        Assign Now
                    </Button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#1B3C73]" />
                        <h2 className="font-bold text-slate-900 text-sm">Chain of Custody & Assignment History</h2>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                        {asset.assignments?.length || 0} total records
                    </span>
                </div>

                <div className="p-6">
                    {(!asset.assignments || asset.assignments.length === 0) ? (
                        <p className="text-sm text-slate-400 italic text-center py-4">No historical checkout records found for this device.</p>
                    ) : (
                        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
                            {asset.assignments.map((record) => {
                                const isActive = record.status === 'assigned'
                                return (
                                    <div key={record.id} className="relative pl-6">
                                        <div className={`absolute -left-2.25 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${isActive ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-400'
                                            }`}></div>

                                        <div className={`p-4 rounded-lg border ${isActive ? 'bg-blue-50/40 border-blue-200' : 'bg-slate-50/60 border-slate-200/70'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-slate-900 text-sm">{record.staff?.name}</span>
                                                    <span className="text-xs text-slate-500 block">{record.staff?.department}</span>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                                                    }`}>
                                                    {isActive ? '● Currently Held' : '✓ Returned'}
                                                </span>
                                            </div>

                                            <div className="mt-3 text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200/50 pt-2 font-mono">
                                                <span>Assigned: {new Date(record.assigned_date).toLocaleDateString()}</span>
                                                {record.return_date && (
                                                    <span>Returned: {new Date(record.return_date).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {returnModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-bold text-slate-900 text-sm">Confirm Equipment Return</h3>
                            <button onClick={() => setReturnModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">
                            Marking <strong>{asset.name}</strong> as returned from <strong>{activeAssignment?.staff?.name}</strong>.
                        </p>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Condition on Return</label>
                            <select
                                value={returnStatus}
                                onChange={(e) => setReturnStatus(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3C73]"
                            >
                                <option value="available">Available (Good condition, back to storage)</option>
                                <option value="under_repair">Needs Repair / Maintenance</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t">
                            <Button variant="outline" onClick={() => setReturnModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="accent" loading={submitting} onClick={handleReturn}>
                                Confirm Return
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}