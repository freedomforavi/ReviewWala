import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { business_slug, customer_name, rating, review_text, source } = await req.json()

    if (!business_slug || !customer_name || !rating || !review_text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()

    // Find the business
    const { data: business } = await supabase
      .from('businesses')
      .select('id, business_name')
      .eq('business_slug', business_slug)
      .single()

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        business_id: business.id,
        customer_name,
        rating: Math.min(5, Math.max(1, rating)),
        review_text,
        source: source || 'link',
        is_approved: false, // moderation by default
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, review })
  } catch (err: any) {
    console.error('Submit review error:', err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
