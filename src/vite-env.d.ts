/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly CORS_ORIGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
