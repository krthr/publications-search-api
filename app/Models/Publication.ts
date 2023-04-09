import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Image from 'App/Models/Image'

export default class Publication extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title?: string

  @column()
  public source?: string

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
