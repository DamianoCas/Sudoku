import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SudokuBoard } from "./SudokuBoard";
import { UsersGames } from "./UsersGames";


@Entity()
export class Game{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    easyMode: boolean;

    @ManyToOne(() => SudokuBoard, (board) => board.games)
    board: SudokuBoard;

    @OneToMany(() => UsersGames, (usersGame) => usersGame.game)
    usersGame: UsersGames;
}