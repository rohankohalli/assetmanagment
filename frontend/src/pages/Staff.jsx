import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import toast from 'react-hot-toast'
import { Plus, Eye } from 'lucide-react'

export default function Staff() {
    const navigate = useNavigate()
    const [staffList, setStaffList] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStaff = async () => {
        try {
            setLoading(true)
            const data = await api('/staff')
            setStaffList(data)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStaff()
    }, [])

    return (
        <div className="space-y-6">
            <PageHeader title="Staff Directory" description="Teachers and department personnel holding equipment">
                <Button variant="primary" onClick={() => navigate('/staff/new')}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Staff Member
                </Button>
            </PageHeader>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-semibold border-b">
                        <tr>
                            <th className="px-6 py-3.5">Name</th>
                            <th className="px-6 py-3.5">Email</th>
                            <th className="px-6 py-3.5">Department</th>
                            <th className="px-6 py-3.5">Assets Held</th>
                            <th className="px-6 py-3.5 text-right">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                    Loading staff directory...
                                </td>
                            </tr>
                        ) : staffList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                    No staff members registered.
                                </td>
                            </tr>
                        ) : (
                            staffList.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-3.5 font-medium text-slate-900 flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1B3C73] flex items-center justify-center font-bold text-xs">
                                            {s.name.charAt(0)}
                                        </div>
                                        {s.name}
                                    </td>
                                    <td className="px-6 py-3.5 text-slate-500">{s.email}</td>
                                    <td className="px-6 py-3.5">{s.department}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold ${s.assets_held_count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {s.assets_held_count} item{s.assets_held_count !== 1 ? 's' : ''}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <Link
                                            to={`/staff/${s.id}`}
                                            className="inline-flex items-center text-xs font-semibold text-[#1B3C73] hover:underline"
                                        >
                                            <Eye className="w-4 h-4 mr-1" /> View Holdings
                                        </Link>
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