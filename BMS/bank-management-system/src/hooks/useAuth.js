import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// AuthContext ka shortcut — har jagah useContext(AuthContext) likhne ki zaroorat nahi
const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}

export default useAuth