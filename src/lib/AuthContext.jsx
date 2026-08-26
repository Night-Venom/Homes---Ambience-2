import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  async function loadUser(authUser) {
    if (!authUser) {
      setUser(null)
      setIsLoadingAuth(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', authUser.id)
      .maybeSingle()

    setUser({
      ...authUser,
      full_name: profile?.full_name ?? '',
      email: profile?.email ?? authUser.email,
    })
    setIsLoadingAuth(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => loadUser(data.session?.user))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser(session?.user)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoadingAuth,
        isLoadingPublicSettings: false,
        authError: null,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
