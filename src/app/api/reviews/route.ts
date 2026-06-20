import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const token = searchParams.get('token')

  // Use service_role key to bypass RLS (showcase page needs public read access)
  const supabase = createServiceClient()

  // Public: get approved reviews by slug (for widget)
  if (slug && !token) {
    const { data: business } = await supabase
      .from('businesses')
      .select('id, business_name, whatsapp_number, website_url, phone, address, description, category, opening_hours, services, instagram, facebook')
      .eq('business_slug', slug)
      .single()

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', business.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    return NextResponse.json({ business_name: business.business_name, whatsapp_number: business.whatsapp_number, website_url: business.website_url, phone: business.phone, address: business.address, description: business.description, category: business.category, opening_hours: business.opening_hours, services: business.services, instagram: business.instagram, facebook: business.facebook, reviews })
  }

  // Admin: get reviews by token
  if (token) {
    const { data: tokenRow } = await supabase
      .from('business_tokens')
      .select('business_id')
      .eq('token', token)
      .single()

    if (!tokenRow) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', tokenRow.business_id)
      .single()

    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', tokenRow.business_id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ business, reviews })
  }

  return NextResponse.json({ error: 'Provide slug or token' }, { status: 400 })
}
