import { NextResponse } from 'next/server'
import { Client } from 'pg'

const DB_PW = 'jwehFIWjiJM123'
const DB_REF = 'pnlpkukuaekpvhxdpmbn'

// Try all connection combinations with the DB password
const combos = [
  // Direct (pooler disabled? maybe it resolves on Vercel)
  ...[5432].map(p => ({ host: 'db.' + DB_REF + '.supabase.co', port: p, database: 'postgres', user: 'postgres', password: DB_PW, ssl: { rejectUnauthorized: false } })),
  // Pooler region host (used by PostgREST internally)
  ...[6543].map(p => ({ host: 'aws-0-ap-south-1.pooler.supabase.com', port: p, database: DB_REF, user: 'postgres', password: DB_PW, ssl: { rejectUnauthorized: false } })),
  ...[6543].map(p => ({ host: 'aws-0-ap-south-1.pooler.supabase.com', port: p, database: 'postgres', user: 'postgres', password: DB_PW, ssl: { rejectUnauthorized: false } })),
  ...[5432].map(p => ({ host: 'aws-0-ap-south-1.pooler.supabase.com', port: p, database: 'postgres', user: 'postgres', password: DB_PW, ssl: { rejectUnauthorized: false } })),
  // Try with postgres.{ref} user (Supavisor user format)
  ...[6543].map(p => ({ host: 'aws-0-ap-south-1.pooler.supabase.com', port: p, database: 'postgres', user: 'postgres.' + DB_REF, password: DB_PW, ssl: { rejectUnauthorized: false } })),
  ...[6543].map(p => ({ host: 'aws-0-ap-south-1.pooler.supabase.com', port: p, database: DB_REF, user: 'postgres.' + DB_REF, password: DB_PW, ssl: { rejectUnauthorized: false } })),
]
const DB_PORT = 5432

export async function GET() {
  let lastErr = ''
  for (const combo of combos) {
    try {
      const client = new Client(combo)
      await client.connect()
      const test = await client.query('SELECT 1 AS connected')
      // ... run migration
      const results: string[] = []
      const stmts = [
        `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS description TEXT;`,
        `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS category TEXT;`,
        `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS opening_hours TEXT;`,
        `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS services TEXT;`,
        `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS instagram TEXT;`,
        `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS facebook TEXT;`,
        `DROP POLICY IF EXISTS "businesses_select_public" ON businesses;`,
        `CREATE POLICY "businesses_select_public" ON businesses FOR SELECT TO public USING (true);`,
      ]
      for (const sql of stmts) {
        try { await client.query(sql); results.push('OK') }
        catch (e: unknown) { results.push('FAIL: ' + (e instanceof Error ? e.message : String(e)).slice(0, 100)) }
      }
      await client.end()
      return NextResponse.json({ host: combo.host, connected: test.rows, results })
    } catch (e: unknown) {
      lastErr = (e instanceof Error ? e.message : String(e))
    }
  }
  return NextResponse.json({ error: 'all hosts failed', lastErr }, { status: 500 })
}
