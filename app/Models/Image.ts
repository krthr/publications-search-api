import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Publication from 'App/Models/Publication'

export default class Image extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Publication)
  public publication: BelongsTo<typeof Publication>

  @column()
  public publicationId: number

  @column()
  public mediaPath: string

  @column()
  public mediaPreview: string

  @column()
  public distance?: number

  @column({
    prepare(value: number[]) {
      return JSON.stringify(value)
    },
    serialize(value: string) {
      return JSON.parse(value)
    },
  })
  public embedding: number[]

  @column()
  public tags: string[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
