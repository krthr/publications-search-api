import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Image from 'App/Models/Image'
import Logger from '@ioc:Adonis/Core/Logger'
import Publication from 'App/Models/Publication'
import { getImageEmbedding } from 'App/Services/Ml'
import { readAndParseImage } from 'App/Services/Sharp'

export default class PublicationsController {
  public async store({ request, response }: HttpContextContract) {
    const images = request.files('images', { extnames: ['jpg', 'png', 'jpeg'], size: '10mb' })

    Logger.info({ totalImages: images.length }, 'PublicationsController.store')

    if (images.length === 0) {
      return response.badRequest()
    }

    const invalidImage = images.find((image) => !image.isValid)
    if (invalidImage) {
      return invalidImage.errors
    }

    const publication = await Publication.create({})

    for (const { tmpPath } of images) {
      const parsedImage = await readAndParseImage(tmpPath!)

      if (!parsedImage) {
        continue
      }

      const embedding = await getImageEmbedding(parsedImage.jpgBuff, 'image.jpg', 'image/jpeg')
      if (!embedding) {
        continue
      }

      await publication.related('images').create({
        embedding,
        mediaPath: '',
        mediaPreview: parsedImage.preview,
      })
    }

    return {
      publication,
      images: await Image.query()
        .select(['id', 'media_path', 'media_preview', 'tags', 'created_at', 'updated_at'])
        .where('publication_id', publication.id),
    }
  }

  public async search({ request, response }: HttpContextContract) {
    const image = request.file('image', { extnames: ['jpg', 'png', 'jpeg'], size: '10mb' })
    const page = request.input('page', 1)

    Logger.info({}, 'PublicationsController.search')

    if (!image) {
      return response.badRequest()
    }

    const parsedImage = await readAndParseImage(image.tmpPath!)
    if (!parsedImage) {
      return image.errors
    }

    const embedding = await getImageEmbedding(parsedImage.jpgBuff, 'image.jpg', 'image/jpeg')
    if (!embedding) {
      return response.badRequest()
    }

    const embeddingArray = JSON.stringify(embedding)
    const images = await Image.query()
      .preload('publication')
      .select(
        'id',
        'publication_id',
        'tags',
        'media_path',
        'media_preview',
        Database.raw(`1 - (embedding <=> '${embeddingArray}') as distance`)
      )
      .orderBy('distance', 'desc')
      .paginate(page, 30)

    return images
  }
}
