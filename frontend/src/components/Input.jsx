export default function Input({
    label,
    icon: Icon,
    error,
    id,
    type = 'text',
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
            <div className="relative">
                {Icon && (
                    <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
                <input
                    id={id}
                    type={type}
                    className={`w-full ${Icon ? 'pl-9' : 'px-3.5'} pr-3.5 py-2 border rounded-lg text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3C73] focus:border-transparent transition ${error ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-300'
                        } ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
        </div>
    )
}