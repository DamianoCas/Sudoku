import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Game } from "./entity/Game"
import { UsersGames } from "./entity/UsersGames"
import { SudokuBoard } from "./entity/SudokuBoard"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "postgres",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User, Game, UsersGames, SudokuBoard],
    migrations: [],
    subscribers: [],
})
