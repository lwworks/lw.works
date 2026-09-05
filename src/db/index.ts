import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const PLACEHOLDER_DATABASE_URL =
  'postgresql://placeholder:placeholder@localhost:5432/placeholder'

function createDb() {
  const sql = neon(process.env.DATABASE_URL ?? PLACEHOLDER_DATABASE_URL)
  return drizzle(sql, { schema })
}

let _db: ReturnType<typeof createDb> | null = null

export function getDb() {
  if (!_db) {
    _db = createDb()
  }
  return _db
}
