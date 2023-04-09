// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Image from 'App/Models/Image'

export default class ImagesController {
  public async index() {
    const images = await Image.query().preload('publication')
    return { images }
  }
}
