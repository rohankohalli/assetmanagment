import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import Alert from '../components/Alert.jsx'
import { Shield, Lock, Mail } from 'lucide-react'

export default function Login() {
    const { login } = useAuth()
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
            window.location.href = '/'
        } catch (err) {
            setError(err.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-[#1B3C73] p-6 text-center border-b-4 border-[#E8751A]">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-[#E8751A] mb-3">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-wide">Harvest International School</h1>
                    <p className="text-blue-200 text-xs mt-1">IT Asset Management Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <Alert type="error" message={error} />

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
                        placeholder="********"
                    />

                    <div className="pt-2">
                        <Button type="submit" variant="primary" loading={loading} className="w-full py-2.5">
                            Sign In to Portal
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}