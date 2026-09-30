export default function StatusBadge({ status }) {
    const s = (status || '').toLowerCase()

    if (s === 'available') {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● Available
            </span>
        )
    }
    if (s === 'assigned') {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                ● Assigned
            </span>
        )
    }
    if (s === 'under_repair') {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                ● Under Repair
            </span>
        )
    }
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
        </span>
    )
}