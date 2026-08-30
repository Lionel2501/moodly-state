// Thin wrapper: the only import here is a relative require into backend/dist,
// so Node module resolution finds backend/node_modules (not a nonexistent
// root node_modules) for everything the compiled Nest app actually needs.
// See backend/src/serverless.ts for the real bootstrap logic — it must be
// imported from the *compiled* dist output, not the .ts source, because
// Vercel's zero-config Node builder transpiles API routes with esbuild,
// which does not support emitDecoratorMetadata (breaking Nest's DI).
// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require('../backend/dist/serverless').default;
