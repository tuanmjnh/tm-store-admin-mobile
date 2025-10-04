import { http } from '@src/plugins/http-axios'

export interface GoogleProfile {
  email?: string
  email_verified?: boolean
  name?: string
  picture?: string
  given_name?: string
  family_name?: string
  iat?: number
  exp?: number
}

export interface GoogleCredentials {
  access_token?: string
  refresh_token?: string
  id_token?: string
  scope?: string
  token_type?: string
  expiry_date?: number
}

export const useGoogleConnectStore = defineStore('googleConnectStore', {
  persist: true,

  state: () => ({
    isAuthorized: false,
    authUrl: null as string | null,
    credentials: {} as GoogleCredentials,
    profile: {} as GoogleProfile,
  }),

  actions: {
    // Get Google OAuth URL to redirect user
    async getAuthUrl(): Promise<string> {
      try {
        const res = await http.get('/connects/google/auth-url')
        this.authUrl = res.data.url
        return res.data.url
      } catch (error: any) {
        console.error('❌ getAuthUrl error:', error)
        throw error
      }
    },

    // Send code to get token + profile (after login)
    async authorizeByCode(code: string, redirectUri: string): Promise<void> {
      try {
        const res = await http.post('/connects/google/callback', {
          code,
          redirectUri,
        })

        const { tokens, profile } = res.data.data
        this.credentials = tokens
        this.profile = profile
        this.isAuthorized = true
      } catch (error: any) {
        console.error('❌ authorizeByCode error:', error)
        throw error
      }
    },

    // Refresh access_token when expired
    async refreshToken(): Promise<void> {
      try {
        const res = await http.post('/connects/google/refresh')
        this.credentials = res.data.data
      } catch (error: any) {
        console.error('❌ refreshToken error:', error)
        throw error
      }
    },

    // Get user profile information
    async getProfile(): Promise<GoogleProfile> {
      try {
        const res = await http.get('/connects/google/profile')
        this.profile = res.data.data
        return res.data.data
      } catch (error: any) {
        console.error('❌ getProfile error:', error)
        throw error
      }
    },

    // Check if logged in or not
    async verifyLogin(): Promise<boolean> {
      if (this.credentials?.access_token) {
        try {
          // Check if the token is still valid (install additional service if desired)
          await this.getProfile()
          this.isAuthorized = true
          return true
        } catch {
          this.isAuthorized = false
          return false
        }
      }
      return false
    },

    // Log out (delete token + profile)
    logout() {
      this.isAuthorized = false
      this.credentials = {}
      this.profile = {}
      this.authUrl = null
    }
  }
})
