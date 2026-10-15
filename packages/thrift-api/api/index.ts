// Vercel serverless entry point.
// Re-exports the Express app so Vercel serves it as a function (see the
// `rewrites` in vercel.json that route every request to `/api`).
import app from '#src/index.js'

export default app
