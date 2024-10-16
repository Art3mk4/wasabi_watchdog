import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export enum ReviewSource {
  DoubleGIS = '2gis',
  YandexMaps = 'yandex_map',
  DeliveryClub = 'delivery_club',
}

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare rating: number

  @column()
  declare text: string | null

  @column()
  declare date: DateTime

  @column()
  declare source: ReviewSource

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
