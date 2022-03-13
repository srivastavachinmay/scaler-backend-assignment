import {MigrationInterface, QueryRunner} from "typeorm";

export class Create1647180823747 implements MigrationInterface {
    name = 'Create1647180823747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`participant\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL DEFAULT 'N/A', \`email\` varchar(255) NOT NULL DEFAULT 'N/A', \`type\` varchar(255) NOT NULL DEFAULT 'N/A', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`interview\` (\`id\` int NOT NULL AUTO_INCREMENT, \`startDateTime\` datetime NOT NULL, \`endDateTime\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`participant_interviews_interview\` (\`participantId\` int NOT NULL, \`interviewId\` int NOT NULL, INDEX \`IDX_07a83f88af4d1544438fb8ce9d\` (\`participantId\`), INDEX \`IDX_36bd8b98749dea9e74c42ad25f\` (\`interviewId\`), PRIMARY KEY (\`participantId\`, \`interviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`participant_interviews_interview\` ADD CONSTRAINT \`FK_07a83f88af4d1544438fb8ce9dc\` FOREIGN KEY (\`participantId\`) REFERENCES \`participant\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`participant_interviews_interview\` ADD CONSTRAINT \`FK_36bd8b98749dea9e74c42ad25f4\` FOREIGN KEY (\`interviewId\`) REFERENCES \`interview\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`participant_interviews_interview\` DROP FOREIGN KEY \`FK_36bd8b98749dea9e74c42ad25f4\``);
        await queryRunner.query(`ALTER TABLE \`participant_interviews_interview\` DROP FOREIGN KEY \`FK_07a83f88af4d1544438fb8ce9dc\``);
        await queryRunner.query(`DROP INDEX \`IDX_36bd8b98749dea9e74c42ad25f\` ON \`participant_interviews_interview\``);
        await queryRunner.query(`DROP INDEX \`IDX_07a83f88af4d1544438fb8ce9d\` ON \`participant_interviews_interview\``);
        await queryRunner.query(`DROP TABLE \`participant_interviews_interview\``);
        await queryRunner.query(`DROP TABLE \`interview\``);
        await queryRunner.query(`DROP TABLE \`participant\``);
    }

}
