import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  const { token, phone, address, whatsapp_number, website_url, business_name } = await req.json()

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 401 })
  }

  const supabase = createClient()

  // Verify token and get business_id
  const { data: tokenRow } = await supabase
    .from('business_tokens')
    .select('business_id')
    .eq('token', token)
    .single()

  if (!tokenRow) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // Build update object — only set fields that were provided
  const updates: Record<string, string> = {}
  if (phone !== undefined) updates.phone = phone
  if (address !== undefined) updates.address = address
  if (whatsapp_number !== undefined) updates.whatsapp_number = whatsapp_number
  if (website_url !== undefined) updates.website_url = website_url
  if (business_name !== undefined) updates.business_name = business_name

  const { error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', tokenRow.business_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return updated business
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', tokenRow.business_id)
    .single()

  return NextResponse.json({ business })
}
