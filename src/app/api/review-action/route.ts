import { createClient, createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { review_id, action, token } = await req.json()

    if (!review_id || !action || !token) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Verify token
    const { data: tokenRow } = await supabase
      .from('business_tokens')
      .select('business_id')
      .eq('token', token)
      .single()

    if (!tokenRow) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verify review belongs to this business
    const { data: review } = await supabase
      .from('reviews')
      .select('business_id')
      .eq('id', review_id)
      .single()

    if (!review || review.business_id !== tokenRow.business_id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    if (action === 'approve') {
      await supabase.from('reviews').update({ is_approved: true }).eq('id', review_id)
    } else if (action === 'reject') {
      await supabase.from('reviews').delete().eq('id', review_id)
    } else if (action === 'feature') {
      await supabase.from('reviews').update({ is_featured: true }).eq('id', review_id)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Review action error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
