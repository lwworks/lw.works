import { Hono } from 'hono'

import { linear } from './routes/linear.js'

const app = new Hono()

app.get('/', (c) => c.json({ ok: true }))
app.route('/linear', linear)

export default app
