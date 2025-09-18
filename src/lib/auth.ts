import { NextAuthOptions } from 'next-auth'

// Simplified auth config for open access mode

export const authOptions: NextAuthOptions = {
  // Disable all providers for open access
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Return empty token for open access
      return {}
    },
    async session({ session, token }) {
      // Return null session for open access
      return {
        expires: new Date().toISOString(),
        user: {
          id: 'guest',
          name: 'Guest User',
          email: 'guest@platform.ai'
        }
      }
    },
    async signIn({ user, account, profile }) {
      // Disable sign in
      return false
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('Sign in disabled for open access mode')
    },
    async signOut({ session, token }) {
      console.log('Sign out disabled for open access mode')
    },
  },
}