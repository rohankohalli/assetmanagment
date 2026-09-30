export default function Button({
    children,
    variant = 'primary',
    loading = false,
    disabled = false,
    className = '',
    type = 'button',
    onClick,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-[#1B3C73] hover:bg-[#2A4F8F] text-white',
        accent: 'bg-[#E8751A] hover:bg-[#F5923E] text-white',
        outline: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-none',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
            )}
            {children}
        </button>
    )
}