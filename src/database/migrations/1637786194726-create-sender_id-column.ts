import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class createSenderIdColumn1637786194726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.addColumn('statements', new TableColumn({
      name: 'sender_id',
      type: 'uuid',
      isNullable: true
    }));

    await queryRunner.createForeignKey(
      'statements',
      new TableForeignKey({
        columnNames: ["sender_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("statements") as Table;

    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('sender_id') !== -1
    ) as TableForeignKey;

    await queryRunner.dropForeignKey('statements', foreignKey);
    await queryRunner.dropColumn('statements', 'sender_id');
  }
}
