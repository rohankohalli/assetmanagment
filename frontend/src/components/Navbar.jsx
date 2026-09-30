import { useAuth } from '../context/AuthContext.jsx'
import { LogOut, UserCircle } from 'lucide-react'

export default function Navbar() {
    const { user, logout } = useAuth()

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-xs">
            <h2 className="text-sm font-bold text-[#1B3C73] tracking-wide">
                Harvest Group of Schools <span className="text-xs font-normal text-slate-400">| IT Inventory System</span>
            </h2>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                    <UserCircle className="w-5 h-5 text-[#1B3C73]" />
                    <span className="font-semibold text-slate-800">{user?.name || 'IT Admin'}</span>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                </button>
            </div>
        </header>
    )
}