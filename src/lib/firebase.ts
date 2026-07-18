import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const cfg = {
  apiKey: import.meta.env.VITE_FB_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FB_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET as string | undefined,
  appId: import.meta.env.VITE_FB_APP_ID as string | undefined,
}

/** True once real Firebase credentials are in .env — until then the site runs on fallback content. */
export const firebaseReady = Boolean(cfg.apiKey && cfg.projectId && cfg.appId)

const app = initializeApp(
  firebaseReady
    ? (cfg as Record<string, string>)
    : { apiKey: 'demo', authDomain: 'demo.firebaseapp.com', projectId: 'demo', appId: 'demo' },
)

export const auth = getAuth(app)
export const db = getFirestore(app)

let storageInstance: FirebaseStorage | null = null
if (firebaseReady && cfg.storageBucket) {
  try {
    storageInstance = getStorage(app)
  } catch {
    storageInstance = null
  }
}
/** Null when Storage is unavailable (e.g. Spark plan without a bucket) — admin falls back to image URLs. */
export const storage = storageInstance
