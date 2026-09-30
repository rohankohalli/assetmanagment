export default function Select({
    label,
    options = [],
    error,
    id,
    className = '',
    ...props
}) {
    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
                    {label}
                </label>
            )}
            <select
                id={id}
                className={`w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B3C73] focus:border-transparent transition ${error ? 'border-red-300' : 'border-slate-300'
                    } ${className}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value ?? opt} value={opt.value ?? opt}>
                        {opt.label ?? opt}
                    </option>
                ))}
            </select>
            {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
        </div>
    )
}