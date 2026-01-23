'use client'

import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        setSession(data.session)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading session')
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (loginError) throw loginError
      setSession(data.session)
      return { success: true, session: data.session }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error logging in'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      const { error: logoutError } = await supabase.auth.signOut()
      if (logoutError) throw logoutError
      setSession(null)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error logging out'
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
