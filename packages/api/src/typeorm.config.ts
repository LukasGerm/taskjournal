import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "taskjournal",
  username: "postgres",
  password: "mysecretpassword",
  synchronize: false,
  entities: ["**/*.entity.ts"],
  migrations: ["src/database/migrations/*-migration.ts"],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
