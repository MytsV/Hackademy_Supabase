import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Account from '../components/Account'
import AuthBasic from '../components/Auth'

export default function Home() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container">
      {!session ? <AuthBasic /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}
