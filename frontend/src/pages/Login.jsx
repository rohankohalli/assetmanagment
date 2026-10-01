import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(email, password)
            navigate('/')
        } catch (err) {
            setError(err.message || 'Invalid email or password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
                <div className="bg-[#1B3C73] p-7 text-center border-b-4 border-[#E8751A]">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-[#E8751A] mb-3 shadow-inner">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-wide">
                        Harvest International School
                    </h1>
                    <p className="text-blue-200 text-xs mt-1 font-medium">
                        IT Asset Management Portal
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    {error && (
                        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    <Input
                        label="Admin Email"
                        type="email"
                        icon={Mail}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@harvest.in"
                    />

                    <Input
                        label="Password"
                        type="password"
                        icon={Lock}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            className="w-full py-2.5 text-xs font-bold"
                        >
                            Sign In to Portal
                        </Button>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-center">
                        <p className="text-[11px] text-slate-400">
                            Default Admin: <span className="font-mono text-slate-600 font-semibold">admin@harvest.in</span> / <span className="font-mono text-slate-600 font-semibold">Test@123</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}