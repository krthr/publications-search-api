import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'images'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table
        .bigInteger('publication_id')
        .references('id')
        .inTable('publications')
        .notNullable()
        .onDelete('CASCADE')

      table.text('media_path').notNullable()
      table.text('media_preview')
      table.json('media_metadata').defaultTo('{}')

      table.specificType('embedding', 'vector(512)').notNullable()
      table.specificType('tags', 'text[]').defaultTo('{}')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
