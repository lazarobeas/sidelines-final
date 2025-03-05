import { createClient } from '@supabase/supabase-js'

// This client uses the SUPABASE_SERVICE_ROLE_KEY which has admin privileges
// and should only be used in trusted server environments
export const createServiceRoleClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing Supabase service role environment variables')
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}