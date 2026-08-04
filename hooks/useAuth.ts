'use client'

import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { setApiToken } from '../utils/api-client'

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let unsubscribe: (() => void) | undefined

    try {
      console.log('🔐 Initializing auth session...')

      // Use onAuthStateChange - more reliable than getSession()
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log('🔐 Auth state changed:', event, { hasSession: !!newSession })

          if (mounted) {
            if (newSession) {
              console.log('✅ Session active:', newSession.user.email)
              setSession(newSession)
              setApiToken(newSession.access_token)
            } else {
              console.log('❌ Session cleared')
              setSession(null)
              setApiToken(null)
            }
            setLoading(false)
          }
        }
      )

      unsubscribe = () => subscription?.unsubscribe()
    } catch (err) {
      console.error('❌ Auth initialization error:', err)
      if (mounted) {
        setError(err instanceof Error ? err.message : 'Error initializing auth')
        setLoading(false)
      }
    }

    return () => {
      mounted = false
      unsubscribe?.()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔑 Attempting login for:', email)
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) throw loginError

      console.log('✅ Login successful:', data.user.email)
      setSession(data.session)
      setApiToken(data.session?.access_token || null)

      return { success: true, session: data.session }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error logging in'
      console.error('❌ Login error:', message)
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      console.log('👋 Logging out...')
      const { error: logoutError } = await supabase.auth.signOut()
      if (logoutError) throw logoutError
      setSession(null)
      setApiToken(null)
      console.log('✅ Logged out successfully')
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error logging out'
      console.error('❌ Logout error:', message)
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const getUser = () => session?.user

  return {
    session,
    loading,
    error,
    login,
    logout,
    getUser,
    isAuthenticated: !!session,
  }
}
