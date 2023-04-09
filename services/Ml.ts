import Axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import FormData from 'form-data'
import Logger from '@ioc:Adonis/Core/Logger'

const client = Axios.create({
  baseURL: Env.get('ML_SERVICE_URL'),
})

interface ImageEmbeddings {
  error?: any
  data?: {
    content_type: string
    embeddings: number[]
    filename: string
    size: number
  }
}

export async function imageEmbeddings(image: Buffer, filename: string, contentType: string) {
  Logger.info({ contentType, filename }, 'imageEmbeddings')

  const body = new FormData()
  body.append('image', image, { contentType, filename })

  try {
    const response = await client.post<ImageEmbeddings>('/image/embeddings', body)

    if (response.data?.error || !response.data.data) {
      return undefined
    }

    return response.data.data.embeddings
  } catch (error) {
    Logger.error({ contentType, filename }, error)

    return undefined
  }
}
