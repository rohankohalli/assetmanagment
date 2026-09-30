export default function PageHeader({ title, description, children }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-2.5">{children}</div>}
        </div>
    )
}