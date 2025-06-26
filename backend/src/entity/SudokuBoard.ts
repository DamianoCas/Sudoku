import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Game } from "./Game";


@Entity()
export class SudokuBoard{
    @PrimaryColumn()
    id: number;

    @Column()
    puzzle: string;

    @Column()
    solution: string;

    @Column()
    clues: number;

    @Column()
    difficulty: number;

    @OneToMany(() => Game, (game) => game.board)
    games: Game[];
}