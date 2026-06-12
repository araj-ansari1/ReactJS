import { useState } from 'react'

// localStorage ko React state ki tarah use karne ka hook
// value automatically save aur load hoti hai

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key)
            // Agar pehle se value save hai toh woh load karo
            return item ? JSON.parse(item) : initialValue
        } catch {
            return initialValue
        }
    })

    const setValue = (value) => {
        try {
            setStoredValue(value)
            // React state ke saath localStorage bhi update karo
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('localStorage error:', error)
        }
    }

    const removeValue = () => {
        try {
            setStoredValue(null)
            localStorage.removeItem(key)
        } catch (error) {
            console.error('localStorage remove error:', error)
        }
    }

    return [storedValue, setValue, removeValue]
}