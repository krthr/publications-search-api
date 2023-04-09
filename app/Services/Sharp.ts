import Logger from '@ioc:Adonis/Core/Logger'
import Sharp from 'sharp'
import { readFile } from 'node:fs/promises'

export async function readAndParseImage(filepath: string) {
  Logger.info({ filepath }, 'readAndParseImage')

  try {
    const buff = await readFile(filepath)
    const sharp = Sharp(buff).jpeg()

    const { data: jpgBuff, info: metadata } = await sharp
      .resize(800, null)
      .toBuffer({ resolveWithObject: true })

    const previewBuff = await sharp.resize(2, null).toBuffer()
    const preview = 'data:image/jpg;base64,' + previewBuff.toString('base64')

    return { jpgBuff, preview, metadata }
  } catch (error: any) {
    Logger.error({ filepath }, error)
    return undefined
  }
}
