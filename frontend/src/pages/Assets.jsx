import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import StatusBadge from '../components/StatusBadge.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import Papa from 'papaparse'
import toast from 'react-hot-toast'
import { Search, Download, Plus, Filter, Eye, Edit2 } from 'lucide-react'

export default function Assets() {
    const navigate = useNavigate()
    const [assets, setAssets] = useState([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [typeFilter, setTypeFilter] = useState('All')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAssets()
    }, [statusFilter, typeFilter, search])

    const fetchAssets = async () => {
        try {
            setLoading(true)
            const query = new URLSearchParams()
            if (statusFilter !== 'All') query.append('status', statusFilter)
            if (typeFilter !== 'All') query.append('type', typeFilter)
            if (search.trim()) query.append('search', search.trim())

            const data = await api(`/assets?${query.toString()}`)
            setAssets(data)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const exportToCSV = async () => {
        try {
            const data = await api('/assets/export/csv')
            const csv = Papa.unparse(data)
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Harvest_IT_Assets_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            toast.success('CSV downloaded successfully!')
        } catch (err) {
            toast.error('Export failed: ' + err.message)
        }
    }

    const statuses = ['All', 'available', 'assigned', 'under_repair']
    const types = ['All', 'laptop', 'monitor', 'phone', 'other']

    return (
        <div className="space-y-6">
            <PageHeader title="IT Assets Inventory" description="Track, search, and manage school hardware equipment">
                <Button variant="outline" onClick={exportToCSV}>
                    <Download className="w-4 h-4 mr-1.5" /> Export CSV
                </Button>
                <Button variant="primary" onClick={() => navigate('/assets/new')}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Asset
                </Button>
            </PageHeader>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            icon={Search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by asset name, tag, or serial number..."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B3C73]"
                        >
                            {types.map(t => (
                                <option key={t} value={t}>{t === 'All' ? 'All Device Types' : t.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 mr-2">Status:</span>
                    {statuses.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${statusFilter === s
                                    ? 'bg-[#1B3C73] text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {s === 'under_repair' ? 'Under Repair' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="px-6 py-3.5">Asset Tag</th>
                                <th className="px-6 py-3.5">Device Name</th>
                                <th className="px-6 py-3.5">Type</th>
                                <th className="px-6 py-3.5">Serial Number</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5">Current Holder</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                                        Loading inventory records...
                                    </td>
                                </tr>
                            ) : assets.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                                        No assets found matching the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                assets.map((a) => (
                                    <tr key={a.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-3.5 font-mono font-bold text-[#1B3C73]">
                                            {a.asset_tag}
                                        </td>
                                        <td className="px-6 py-3.5 font-medium text-slate-900">{a.name}</td>
                                        <td className="px-6 py-3.5 capitalize">{a.type}</td>
                                        <td className="px-6 py-3.5 font-mono text-slate-500">{a.serial_number}</td>
                                        <td className="px-6 py-3.5">
                                            <StatusBadge status={a.status} />
                                        </td>
                                        <td className="px-6 py-3.5">
                                            {a.current_holder ? (
                                                <div>
                                                    <p className="font-semibold text-slate-900">{a.current_holder}</p>
                                                    <p className="text-[11px] text-slate-400">{a.holder_department}</p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">None (In Storage)</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3.5 text-right space-x-1">
                                            <Link
                                                to={`/assets/${a.id}`}
                                                className="inline-flex items-center p-1.5 text-blue-700 hover:bg-blue-50 rounded"
                                                title="View History & Return"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                to={`/assets/${a.id}/edit`}
                                                className="inline-flex items-center p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                                                title="Edit Asset"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
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