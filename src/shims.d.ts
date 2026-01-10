// Minimal ambient type shims for non-code assets.
//
// Keep this file limited to non-invasive shims (e.g. CSS imports).
// Do NOT declare core library modules like 'react' here; that can override real typings
// from node_modules and break CI/Vercel builds.

declare module '*.css' {
  const content: string
  export default content
}

declare module 'vite/client' {}
