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

type StoredUser = User & { password?: string }

function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    phone: user.phone,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
    authMethod: user.authMethod,
  }
}

// ─── Utility: Normalize Iranian phone numbers ──────────────────────────────────
export function normalizePhone(phone: string): string {
  const westernDigits = phone
    .replace(/[\u06F0-\u06F9]/g, (digit) => String(digit.charCodeAt(0) - 0x06F0))
    .replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
  let cleaned = westernDigits.replace(/[^0-9+]/g, '')
  if (cleaned.startsWith('+98')) {
    cleaned = '0' + cleaned.slice(3)
  } else if (cleaned.startsWith('98')) {
    cleaned = '0' + cleaned.slice(2)
  }
  return cleaned
}

// ─── In-memory Mock Database (Do not persist to localStorage) ────────────────
const MOCK_DB = {
  users: new Map<string, StoredUser>(),
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

    return { token, user: toPublicUser(user) }
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

    return { token, user: toPublicUser(user) }
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

    return { token, user: toPublicUser(user) }
  }

  async logout(token: string): Promise<void> {
    await this.delay(300)
    MOCK_DB.sessions.delete(token)
  }
}

// Frontend-only adapter. A Go integration will also need server-issued session
// semantics, transport/error mapping, and secure token handling at this boundary.
export const authService: AuthService = new MockAuthServiceImpl()
