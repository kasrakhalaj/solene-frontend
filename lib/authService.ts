export interface User {
  id: string
  phone?: string
  email?: string
  displayName?: string
  createdAt: string
  authMethod: 'phone' | 'email'
}

export interface AuthSession {
  token: string
  user: User
}

export interface AuthService {
  requestOtp(phone: string): Promise<void>
  verifyOtp(phone: string, otp: string): Promise<AuthSession>
  loginWithEmail(email: string, password: string): Promise<AuthSession>
  signupWithEmail(email: string, password: string): Promise<AuthSession>
  logout(token: string): Promise<void>
}

// ─── Utility: Normalize Iranian phone numbers ──────────────────────────────────
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, '')
  if (cleaned.startsWith('+98')) {
    cleaned = '0' + cleaned.slice(3)
  } else if (cleaned.startsWith('98')) {
    cleaned = '0' + cleaned.slice(2)
  }
  return cleaned
}

// ─── In-memory Mock Database (Do not persist to localStorage) ────────────────
const MOCK_DB = {
  users: new Map<string, User & { password?: string }>(),
  sessions: new Set<string>()
}

const MOCK_OTP = '123456'

// ─── Mock Implementation ───────────────────────────────────────────────────────

class MockAuthServiceImpl implements AuthService {
  private async delay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async requestOtp(phone: string): Promise<void> {
    await this.delay()
    const normalized = normalizePhone(phone)
    if (!normalized.startsWith('09') || normalized.length !== 11) {
      throw new Error('invalid_phone')
    }
    // In a real app, this triggers an SMS.
  }

  async verifyOtp(phone: string, otp: string): Promise<AuthSession> {
    await this.delay()
    if (otp !== MOCK_OTP) {
      throw new Error('invalid_otp')
    }

    const normalized = normalizePhone(phone)
    
    // Find or create user
    let user = Array.from(MOCK_DB.users.values()).find(u => u.phone === normalized)
    
    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        phone: normalized,
        createdAt: new Date().toISOString(),
        authMethod: 'phone'
      }
      MOCK_DB.users.set(user.id, user)
    }

    const token = `tok_${Date.now()}_${Math.random().toString(36).substring(7)}`
    MOCK_DB.sessions.add(token)

    const { password, ...safeUser } = user
    return { token, user: safeUser }
  }

  async signupWithEmail(email: string, password: string): Promise<AuthSession> {
    await this.delay()
    const normalized = email.toLowerCase().trim()
    
    const existing = Array.from(MOCK_DB.users.values()).find(u => u.email === normalized)
    if (existing) {
      throw new Error('email_exists')
    }

    const user = {
      id: `usr_${Date.now()}`,
      email: normalized,
      password, // Mock storing password in memory only
      createdAt: new Date().toISOString(),
      authMethod: 'email' as const
    }
    MOCK_DB.users.set(user.id, user)

    const token = `tok_${Date.now()}_${Math.random().toString(36).substring(7)}`
    MOCK_DB.sessions.add(token)

    const { password: _, ...safeUser } = user
    return { token, user: safeUser }
  }

  async loginWithEmail(email: string, password: string): Promise<AuthSession> {
    await this.delay()
    const normalized = email.toLowerCase().trim()
    
    const user = Array.from(MOCK_DB.users.values()).find(u => u.email === normalized)
    
    if (!user || user.password !== password) {
      throw new Error('invalid_credentials')
    }

    const token = `tok_${Date.now()}_${Math.random().toString(36).substring(7)}`
    MOCK_DB.sessions.add(token)

    const { password: _, ...safeUser } = user
    return { token, user: safeUser }
  }

  async logout(token: string): Promise<void> {
    await this.delay(300)
    MOCK_DB.sessions.delete(token)
  }
}

// Export a singleton instance. 
// When replacing with Go backend, just implement a new class and export it here.
export const authService: AuthService = new MockAuthServiceImpl()
