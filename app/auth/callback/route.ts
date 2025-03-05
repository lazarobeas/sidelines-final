import { NextApiRequest, NextApiResponse } from 'next';
import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {createServiceRoleClient} from "@/utils/supabase/service-role";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { body } = req;
//     console.log('Callback received:', body);
//
//     // Handle the callback logic here
//
//     res.status(200).json({ message: 'Callback received' });
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// GET request to verify the code and grant user a profile into the database
export async function GET(request: NextRequest){
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/feed'

  // Edge case if there is no code
  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
  }


  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    // Authorization code failure edge case
    if (error) {
      console.error('Auth code exchange error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_exchange_failed`)
    }

    // Get the user
    const {data: {user}} = await supabase.auth.getUser()

    if (user) {
      // checking if the user exists
      const {data: existingProfile} = await supabase
          .from('Users')
          .select('id')
          .eq('user_id', user.id)
          .single()

      // if user doesn't already exist, create one in our DB table Users
      if (!existingProfile) {
        console.log('Creating new user profile for:', user.email)

        const serviceRole = createServiceRoleClient()

        const {error: profileError} = await serviceRole
            .from('Users')
            .insert({
              id: user.id,
              email: user.email || '',
            })

        if (profileError){
          console.log('Error creating user:', profileError)
          return NextResponse.redirect(`${requestUrl.origin}/login?error=user_creation_error`)
        }
      }
    }
  // we have already created user, let's redirect him to the next page
    return NextResponse.redirect(`${requestUrl.origin}${next}`)

  } catch (error) {
    console.log('Unknown error occurred in auth flow:', error)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=server_error_generic`)
  }
}