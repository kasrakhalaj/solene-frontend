import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, type User } from './authService'

export interface AuthState {
  user: User | null
  token: string | null
  
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
        })
      },

      loginWithEmail: async (email: string, password: string) => {
        const session = await authService.loginWithEmail(email, password)
        set({ 
          user: session.user, 
          token: session.token,
        })
      },

      signupWithEmail: async (email: string, password: string) => {
        const session = await authService.signupWithEmail(email, password)
        set({ 
          user: session.user, 
          token: session.token,
        })
      },

      logout: async () => {
        const { token } = get()
        if (token) {
          try {
            await authService.logout(token)
          } catch {
            // Local logout must still complete if the mock session is unavailable.
          }
        }
        set({ user: null, token: null })
      }
    }),
    {
      name: 'solene-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)

/** Authentication is derived from the persisted session, never stored separately. */
export const selectIsAuthenticated = (state: AuthState): boolean =>
  Boolean(state.user && state.token)
