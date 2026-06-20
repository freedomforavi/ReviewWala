import { NextResponse } from 'next/server'
import { Client } from 'pg'

export async function GET() {
  const ref = 'pnlpkukuaekpvhxdpmbn'
  const pw = 'jwehFIWjiJM123'
  const pooler = 'aws-0-ap-south-1.pooler.supabase.com'

  const client = new Client({
    host: pooler,
    port: 6543,
    database: 'postgres',
    user: 'postgres',
    password: pw,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    const test = await client.query('SELECT 1 AS connected')
    const results: string[] = []
    const sqls = [
      'ALTER TABLE businesses ADD COLUMN IF NOT EXISTS description TEXT;',
      'ALTER TABLE businesses ADD COLUMN IF NOT EXISTS category TEXT;',
      'ALTER TABLE businesses ADD COLUMN IF NOT EXISTS opening_hours TEXT;',
      'ALTER TABLE businesses ADD COLUMN IF NOT EXISTS services TEXT;',
      'ALTER TABLE businesses ADD COLUMN IF NOT EXISTS instagram TEXT;',
      'ALTER TABLE businesses ADD COLUMN IF NOT EXISTS facebook TEXT;',
      'DROP POLICY IF EXISTS "businesses_select_public" ON businesses;',
      'CREATE POLICY "businesses_select_public" ON businesses FOR SELECT TO public USING (true);',
    ]
    for (const sql of sqls) {
      try {
        await client.query(sql)
        results.push('OK: ' + sql.slice(0, 60))
      } catch (e: any) {
        results.push('FAIL: ' + (e.message || '').slice(0, 100))
      }
    }
    await client.end()
    return NextResponse.json({ connected: test.rows[0], results })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
