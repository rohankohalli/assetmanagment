import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { LayoutDashboard, Laptop, Users, ClipboardCheck, LogOut, Shield } from 'lucide-react'

export default function Sidebar() {
    const location = useLocation()
    const { user, logout } = useAuth()

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Assets', path: '/assets', icon: Laptop },
        { name: 'Staff', path: '/staff', icon: Users },
        { name: 'Assignments', path: '/assignments', icon: ClipboardCheck },
    ]

    return (
        <aside className="w-64 bg-[#1B3C73] text-white flex flex-col min-h-screen fixed left-0 top-0 border-r border-[#132C55] shadow-xl z-20">
            <div className="h-16 flex items-center px-6 bg-[#132C55] border-b-[3px] border-[#E8751A]">
                <Shield className="w-6 h-6 text-[#E8751A] mr-3 flex-shrink-0" />
                <div>
                    <h1 className="font-bold text-sm leading-tight text-white">Harvest Int. School</h1>
                    <p className="text-[10px] text-blue-200 uppercase tracking-widest">IT Asset Manager</p>
                </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive
                                    ? 'bg-[#2A4F8F] text-white shadow-xs border-l-4 border-[#E8751A]'
                                    : 'text-gray-200 hover:bg-[#2A4F8F]/60 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-[#E8751A]' : 'text-gray-300'}`} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 bg-[#132C55] border-t border-[#2A4F8F]">
                <div className="flex items-center justify-between">
                    <div className="overflow-hidden mr-2">
                        <p className="text-xs font-semibold text-white truncate">{user?.name || 'IT Administrator'}</p>
                        <p className="text-[10px] text-gray-300 truncate">{user?.email || 'admin@harvest.in'}</p>
                    </div>
                    <button
                        onClick={logout}
                        title="Sign Out"
                        className="p-2 text-gray-300 hover:text-white hover:bg-red-600/80 rounded-lg transition-colors flex-shrink-0"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    )
}