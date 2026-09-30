const API_URL = import.meta.env.VITE_API_URL

export const api = async (endpoint, method = 'GET', body = null) => {
    const token = localStorage.getItem('harvest_token')

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: body ? JSON.stringify(body) : null
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
}