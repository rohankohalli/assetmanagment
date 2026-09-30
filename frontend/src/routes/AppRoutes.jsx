import { Routes, Route, Outlet } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Assets from '../pages/Assets.jsx'
import AddAsset from '../pages/AddAsset.jsx'
import AssetDetail from '../pages/AssetDetail.jsx'
import EditAsset from '../pages/EditAsset.jsx'
import Staff from '../pages/Staff.jsx'
import AddStaff from '../pages/AddStaff.jsx'
import StaffDetail from '../pages/StaffDetail.jsx'
import Assignments from '../pages/Assignments.jsx'
import NewAssignment from '../pages/NewAssignment.jsx'

function AppLayout() {
    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <Sidebar />
            <div className="pl-64 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            }>
                <Route path="/" element={<Dashboard />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/assets/new" element={<AddAsset />} />
                <Route path="/assets/:id" element={<AssetDetail />} />
                <Route path="/assets/:id/edit" element={<EditAsset />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/staff/new" element={<AddStaff />} />
                <Route path="/staff/:id" element={<StaffDetail />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/assignments/new" element={<NewAssignment />} />
            </Route>
        </Routes>
    )
}