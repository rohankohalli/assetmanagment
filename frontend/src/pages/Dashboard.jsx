import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import { Laptop, CheckCircle2, UserCheck, Wrench, Plus, ArrowUpRight } from 'lucide-react'

export default function Dashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState({ total: 0, available: 0, assigned: 0, repair: 0 })
    const [recentAssignments, setRecentAssignments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setLoading(true)
            const [assets, assignments] = await Promise.all([
                api('/assets'),
                api('/assigned-assets')
            ])

            const total = assets.length
            const available = assets.filter(a => a.status === 'available').length
            const assigned = assets.filter(a => a.status === 'assigned').length
            const repair = assets.filter(a => a.status === 'under_repair' || a.status === 'maintenance').length

            setStats({ total, available, assigned, repair })
            setRecentAssignments(assignments.slice(0, 5))
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader title="IT Asset Overview" description="Live hardware inventory and staff assignment status">
                <Button variant="outline" onClick={() => navigate('/assets/new')}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Asset
                </Button>
                <Button variant="accent" onClick={() => navigate('/assignments/new')}>
                    <ArrowUpRight className="w-4 h-4 mr-1.5" /> Assign Asset
                </Button>
            </PageHeader>

            {/* 4 KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Assets</p>
                        <p className="text-3xl font-extrabold text-[#1B3C73] mt-1">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-[#1B3C73] rounded-lg">
                        <Laptop className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available</p>
                        <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.available}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned</p>
                        <p className="text-3xl font-extrabold text-blue-600 mt-1">{stats.assigned}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <UserCheck className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Under Repair</p>
                        <p className="text-3xl font-extrabold text-amber-600 mt-1">{stats.repair}</p>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                        <Wrench className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Recent Assignments Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 text-sm">Recent Assignment Activity</h2>
                    <Link to="/assignments" className="text-xs font-semibold text-[#1B3C73] hover:underline">
                        View All Activity →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="px-6 py-3">Asset</th>
                                <th className="px-6 py-3">Staff Member</th>
                                <th className="px-6 py-3">Assigned Date</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {recentAssignments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                                        No recent assignments logged yet.
                                    </td>
                                </tr>
                            ) : (
                                recentAssignments.map((a) => (
                                    <tr key={a.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 font-medium text-slate-900">
                                            {a.asset?.name || 'Asset #' + a.asset_id}
                                            <span className="text-[11px] text-slate-400 block font-normal">{a.asset?.asset_tag}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            {a.staff?.name || 'Staff #' + a.staff_id}
                                            <span className="text-[11px] text-slate-400 block">{a.staff?.department}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            {new Date(a.assigned_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-block px-2.5 py-0.5 text-[10px] rounded-full font-bold ${a.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
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
        </div>
    )
}