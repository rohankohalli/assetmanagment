import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'

export default function Assignments() {
    const navigate = useNavigate()
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        let isMounted = true
        api('/assigned-assets')
            .then((data) => {
                if (isMounted) setAssignments(data)
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
    }, [])

    return (
        <div className="space-y-6">
            <PageHeader title="Assignment Activity Logs" description="Historical records of equipment checkouts and returns">
                <Button variant="accent" onClick={() => navigate('/assignments/new')}>
                    <Plus className="w-4 h-4 mr-1.5" /> New Assignment
                </Button>
            </PageHeader>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-semibold border-b">
                        <tr>
                            <th className="px-6 py-3.5">Asset</th>
                            <th className="px-6 py-3.5">Assigned To</th>
                            <th className="px-6 py-3.5">Assigned Date</th>
                            <th className="px-6 py-3.5">Returned Date</th>
                            <th className="px-6 py-3.5">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                    Loading assignment records...
                                </td>
                            </tr>
                        ) : assignments.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                    No assignment transactions recorded.
                                </td>
                            </tr>
                        ) : (
                            assignments.map((a) => (
                                <tr key={a.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-3.5 font-medium text-slate-900">
                                        <Link to={`/assets/${a.asset_id}`} className="hover:underline text-[#1B3C73]">
                                            {a.asset?.name || 'Asset #' + a.asset_id}
                                        </Link>
                                        <span className="text-[11px] text-slate-400 font-mono block">{a.asset?.asset_tag}</span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <Link to={`/staff/${a.staff_id}`} className="font-semibold text-slate-900 hover:underline">
                                            {a.staff?.name || 'Staff #' + a.staff_id}
                                        </Link>
                                        <span className="text-[11px] text-slate-400 block">{a.staff?.department}</span>
                                    </td>
                                    <td className="px-6 py-3.5">{new Date(a.assigned_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-3.5">
                                        {a.return_date ? (
                                            new Date(a.return_date).toLocaleDateString()
                                        ) : (
                                            <span className="text-blue-600 font-semibold">Active Checkout</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${a.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {a.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}