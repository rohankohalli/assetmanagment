import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client.js'
import Button from '../components/Button.jsx'
import toast from 'react-hot-toast'
import { ArrowLeft, Laptop, Clock, UserCheck, Mail, Building } from 'lucide-react'

export default function StaffDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [staff, setStaff] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        let isMounted = true
        api(`/staff/${id}`)
            .then((data) => {
                if (isMounted) setStaff(data)
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

    if (loading) return <div className="p-12 text-center text-slate-500 font-medium">Loading staff profile...</div>
    if (!staff) return <div className="p-12 text-center text-red-600 font-medium">Staff member not found.</div>

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/staff')}
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Staff Directory
            </button>

            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#1B3C73] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                        {staff.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{staff.name}</h1>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {staff.email}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-semibold text-[#1B3C73]"><Building className="w-3.5 h-3.5" /> {staff.department}</span>
                        </div>
                    </div>
                </div>

                <Button variant="accent" onClick={() => navigate('/assignments/new')}>
                    + Assign Device
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#1B3C73]" />
                        <h2 className="font-bold text-slate-900 text-sm">
                            Equipment Currently in Custody ({staff.currently_held?.length || 0})
                        </h2>
                    </div>
                    <span className="text-[11px] font-semibold text-[#1B3C73] bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                        Active Possession
                    </span>
                </div>

                <div className="p-6">
                    {(!staff.currently_held || staff.currently_held.length === 0) ? (
                        <div className="text-center py-6 text-slate-400 text-xs">
                            ✓ No school hardware is currently checked out to this staff member.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {staff.currently_held.map((asset) => (
                                <div key={asset.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/60 hover:bg-slate-50 transition flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white border border-slate-200 rounded-lg text-[#1B3C73] mt-0.5">
                                            <Laptop className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900">{asset.name}</h4>
                                            <p className="text-xs font-mono text-slate-600 mt-0.5">Tag: <strong className="text-[#1B3C73]">{asset.asset_tag}</strong></p>
                                            <p className="text-[11px] text-slate-400 font-mono">SN: {asset.serial_number}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/assets/${asset.id}`}
                                        className="text-xs font-semibold text-blue-700 hover:underline"
                                    >
                                        Details / Return →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <h2 className="font-bold text-slate-900 text-sm">Past Checkout & Return History</h2>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{staff.assignment_history?.length || 0} events</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="px-6 py-3">Asset</th>
                                <th className="px-6 py-3">Checked Out</th>
                                <th className="px-6 py-3">Returned On</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {(!staff.assignment_history || staff.assignment_history.length === 0) ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-6 text-center text-slate-400">
                                        No historical transactions on record.
                                    </td>
                                </tr>
                            ) : (
                                staff.assignment_history.map((h) => (
                                    <tr key={h.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-3.5 font-medium text-slate-900">
                                            {h.asset?.name || 'Asset #' + h.asset_id}
                                            <span className="text-[11px] text-slate-400 font-mono block">{h.asset?.asset_tag}</span>
                                        </td>
                                        <td className="px-6 py-3.5">{new Date(h.assigned_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-3.5">
                                            {h.return_date ? (
                                                new Date(h.return_date).toLocaleDateString()
                                            ) : (
                                                <span className="text-blue-600 font-semibold">Active (In Use)</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${h.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {h.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}