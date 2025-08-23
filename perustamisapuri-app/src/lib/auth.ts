// Authentication utilities for the demo application

const DEMO_SECRET_KEY = 'TampereNetum2025'
const AUTH_COOKIE_NAME = 'perustamisapuri-auth'

/**
 * Validates if the provided key matches the demo secret key
 */
export function validateSecretKey(key: string): boolean {
  return key === DEMO_SECRET_KEY
}

/**
 * Sets the authentication cookie in the browser
 */
export function setAuthCookie(): void {
  if (typeof document !== 'undefined') {
    // Set cookie for 24 hours
    const expires = new Date()
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000))
    document.cookie = `${AUTH_COOKIE_NAME}=${DEMO_SECRET_KEY}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure=${location.protocol === 'https:'}`
  }
}

/**
 * Removes the authentication cookie from the browser
 */
export function clearAuthCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
  }
}

/**
 * Checks if the user is authenticated by looking for the auth cookie
 */
export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') {
    return false
  }
  
  const cookies = document.cookie.split(';')
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`)
  )
  
  if (!authCookie) {
    return false
  }
  
  const cookieValue = authCookie.split('=')[1]
  return cookieValue === DEMO_SECRET_KEY
}

/**
 * Gets the demo secret key (for development purposes only)
 */
export function getDemoSecretKey(): string {
  return DEMO_SECRET_KEY
}
