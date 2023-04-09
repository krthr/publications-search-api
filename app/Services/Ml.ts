import Env from '@ioc:Adonis/Core/Env'
import FormData from 'form-data'
import Logger from '@ioc:Adonis/Core/Logger'
import fetch from 'node-fetch'

interface ImageEmbeddings {
  error?: any
  data?: {
    content_type: string
    embeddings: number[]
    filename: string
    size: number
  }
}

const ML_SERVICE_URL = Env.get('ML_SERVICE_URL')

export async function getImageEmbedding(
  image: Buffer,
  filename: string,
  contentType: string,
  knownLength?: number
) {
  Logger.info({ contentType, filename }, 'imageEmbeddings')

  const body = new FormData()
  body.append('image', image, { contentType, filename, knownLength })

  const response = await fetch(ML_SERVICE_URL + '/image/embeddings', {
    method: 'POST',
    body,
    headers: {
      ...body.getHeaders(),
    },
  })

  const json = (await response.json()) as ImageEmbeddings

  if (!json.data || json.error) {
    Logger.error({ ...json }, 'getImageEmbedding')
    return undefined
  }

  return json.data.embeddings
}
