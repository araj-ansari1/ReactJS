// Form validation functions — true/false return karte hain

export const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isValidPassword = (password) =>
    password.length >= 6

export const isValidPhone = (phone) =>
    /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))

export const isValidAmount = (amount) =>
    !isNaN(amount) && Number(amount) > 0

export const isValidName = (name) =>
    name.trim().length >= 2