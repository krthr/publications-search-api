import { initializeApp } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

export const firebase = initializeApp()
export const storage = getStorage(firebase)

export const publicationsSearchBucket = storage.bucket('gs://publications-search.appspot.com')
