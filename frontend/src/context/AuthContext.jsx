/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    // Lazy initializers read localStorage once on startup without cascading renders
    const [token, setToken] = useState(() => localStorage.getItem('harvest_token'))
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('harvest_user')
        if (saved) {
            try {
                return JSON.parse(saved)
            } catch {
                localStorage.removeItem('harvest_user')
                return null
            }
        }
        return null
    })

    const login = async (email, password) => {
        const data = await api('/users/login', 'POST', { email, password })
        if (data && data.token) {
            localStorage.setItem('harvest_token', data.token)
            localStorage.setItem('harvest_user', JSON.stringify(data.user))
            setToken(data.token)
            setUser(data.user)
            return data
        }
    }

    const logout = () => {
        localStorage.removeItem('harvest_token')
        localStorage.removeItem('harvest_user')
        setToken(null)
        setUser(null)
        window.location.href = '/login'
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                loading: false,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}