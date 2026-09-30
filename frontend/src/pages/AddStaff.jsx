import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import Select from '../components/Select.jsx'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function AddStaff() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [department, setDepartment] = useState('Science & Robotics')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api('/staff', 'POST', { name, email, department })
            toast.success('Staff member registered successfully!')
            navigate('/staff')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/staff')}
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Staff Directory
            </button>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 border-b pb-4 mb-6">Add Staff Member</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Jane Smith"
                    />

                    <Input
                        label="School Email Address"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jsmith@harvest.in"
                    />

                    <Select
                        label="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        options={[
                            { value: 'Science & Robotics', label: 'Science & Robotics' },
                            { value: 'Mathematics', label: 'Mathematics' },
                            { value: 'English Literature', label: 'English Literature' },
                            { value: 'Computer Science', label: 'Computer Science & IT' },
                            { value: 'Administration', label: 'School Administration' },
                            { value: 'Performing Arts', label: 'Performing Arts' }
                        ]}
                    />

                    <div className="pt-4 border-t flex justify-end gap-3">
                        <Button variant="outline" onClick={() => navigate('/staff')}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={loading}>
                            Add Member
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}