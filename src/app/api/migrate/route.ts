import { NextResponse } from 'next/server'
import { Client } from 'pg'

const DB_PW = 'jwehFIWjiJM123'
const DB_REF = 'pnlpkukuaekpvhxdpmbn'
const DB_HOST = 'db.' + DB_REF + '.supabase.co'
const DB_PORT = 5432

export async function GET() {
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres',
    user: 'postgres',
    password: DB_PW,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    const test = await client.query('SELECT 1 AS connected')
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
      try {
        await client.query(sql)
        results.push('OK')
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        results.push('FAIL: ' + msg.slice(0, 100))
      }
    }

    await client.end()
    return NextResponse.json({ connected: test.rows, results })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
