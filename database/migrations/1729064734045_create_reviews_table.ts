import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.smallint('rating')
      table.string('text', 1024)
      table.enum('source', ['2gis', 'yandex_map', 'delivery_club']).notNullable().defaultTo('2gis')
      table.timestamp('date')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
