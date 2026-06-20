import { NextResponse } from 'next/server'

// This route was used for migration but direct DB connection is not available.
// Run migration SQL in Supabase SQL Editor instead.
export async function GET() {
  return NextResponse.json({ message: 'Use Supabase SQL Editor to run migration SQL' })
}
