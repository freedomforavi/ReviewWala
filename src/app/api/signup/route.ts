import { createServiceClient } from '@/lib/supabase'
import { createId } from '@paralleldrive/cuid2'
import * as bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, phone, businessName, password } = await req.json()

    if (!email || !phone || !businessName || !password) {
      return NextResponse.json(
        { error: 'Email, phone, business name, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Check if email already registered
    const { data: existing } = await supabase
      .from('businesses')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'This email is already registered. Login instead.' },
        { status: 409 }
      )
    }

    // Generate unique slug
    const slug =
      businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      createId().slice(0, 6)

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Create business
    const { data: business, error: bizErr } = await supabase
      .from('businesses')
      .insert({
        email,
        phone,
        business_name: businessName,
        business_slug: slug,
        password_hash,
      })
      .select()
      .single()

    if (bizErr) throw bizErr

    // Create auth token (for session cookie / dashboard access)
    const token = createId()
    const { error: tokErr } = await supabase
      .from('business_tokens')
      .insert({
        business_id: business.id,
        token,
      })

    if (tokErr) throw tokErr

    return NextResponse.json({
      token,
      business_slug: slug,
      business_id: business.id,
      review_url: `${
        process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin
      }/r/${slug}`,
    })
  } catch (err: any) {
    console.error('Signup error:', err)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
