import { serve } from '@hono/node-server'

import app from './index'

const port = 3002
serve({ fetch: app.fetch, port }, () => console.log(`Automation running on http://localhost:${port}`))
