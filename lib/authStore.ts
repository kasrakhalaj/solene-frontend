import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, type User } from './authService'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  loginWithPhone: (phone: string) => Promise<void>
  verifyOtp: (phone: string, otp: string) => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  signupWithEmail: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  
  // Hydration sync
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      loginWithPhone: async (phone: string) => {
        await authService.requestOtp(phone)
      },

      verifyOtp: async (phone: string, otp: string) => {
        const session = await authService.verifyOtp(phone, otp)
        set({ 
          user: session.user, 
          token: session.token,
          isAuthenticated: true 
        })
      },

      loginWithEmail: async (email: string, password: string) => {
        const session = await authService.loginWithEmail(email, password)
        set({ 
          user: session.user, 
          token: session.token,
          isAuthenticated: true 
        })
      },

      signupWithEmail: async (email: string, password: string) => {
        const session = await authService.signupWithEmail(email, password)
        set({ 
          user: session.user, 
          token: session.token,
          isAuthenticated: true 
        })
      },

      logout: async () => {
        const { token } = get()
        if (token) {
          try {
            await authService.logout(token)
          } catch (e) {
            // Ignore logout errors
          }
        }
        set({ user: null, token: null, isAuthenticated: false })
      }
    }),
    {
      name: 'solene-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)
