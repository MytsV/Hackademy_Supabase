import { supabase } from '../utils/supabaseClient'
import { Auth } from '@supabase/ui'

export default function AuthBasic() {
    return (
        <Auth.UserContextProvider supabaseClient={supabase}>
                <Auth supabaseClient={supabase} providers={['google']}/>
        </Auth.UserContextProvider>
    )
}