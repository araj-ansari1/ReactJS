// Fake JWT banata hai — btoa() se base64 encode karta hai
// Real app mein server side JWT hota hai — yahan sirf simulation hai

export const generateToken = (user) => {
    // Sensitive data token mein mat daalo — sirf id aur role
    const payload = {
        id: user.id,
        role: user.role,
        email: user.email,
        iat: Date.now(),              // issued at time
        exp: Date.now() + 86400000,  // 24 hours expiry
    }
    // btoa = browser ka base64 encoder
    return btoa(JSON.stringify(payload))
}

export const decodeToken = (token) => {
    try {
        return JSON.parse(atob(token))  // atob = base64 decoder
    } catch {
        return null
    }
}

export const isTokenExpired = (token) => {
    const decoded = decodeToken(token)
    if (!decoded) return true
    return Date.now() > decoded.exp
}