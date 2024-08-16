// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_SERVER_URL: string
  readonly VITE_APP_SENTRY_DSN: string
  readonly VITE_APP_COPART_MEMBER_PORTAL_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
