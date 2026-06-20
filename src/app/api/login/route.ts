import { createServiceClient } from '@/lib/supabase'
import * as bcrypt from 'bcryptjs'
import { createId } from '@paralleldrive/cuid2'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Find business by email
    const { data: business } = await supabase
      .from('businesses')
      .select('id, business_name, business_slug, password_hash')
      .eq('email', email)
      .maybeSingle()

    if (!business) {
      return NextResponse.json(
        { error: 'No account found with this email. Please sign up.' },
        { status: 401 }
      )
    }

    // Verify password
    const valid = await bcrypt.compare(password, business.password_hash)
    if (!valid) {
      return NextResponse.json(
        { error: 'Incorrect password. Try again.' },
        { status: 401 }
      )
    }

    // Find existing token or create new one
    const { data: existingToken } = await supabase
      .from('business_tokens')
      .select('token')
      .eq('business_id', business.id)
      .maybeSingle()

    let token: string
    if (existingToken) {
      token = existingToken.token
    } else {
      token = createId()
      const { error: tokErr } = await supabase
        .from('business_tokens')
        .insert({ business_id: business.id, token })
      if (tokErr) throw tokErr
    }

    return NextResponse.json({
      token,
      business_slug: business.business_slug,
      business_id: business.id,
    })
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: err?.message || err?.toString() || 'Login failed' },
      { status: 500 }
    )
  }
}
