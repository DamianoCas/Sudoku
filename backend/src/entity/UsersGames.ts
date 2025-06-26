import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Game } from "./Game";


@Entity()
export class UsersGames{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    time: number;

    @Column()
    completed: boolean;

    @Column()
    errors: number;

    @Column()
    winner: boolean;

    @ManyToOne(() => User, (user) => user.userGames)
    user: User;

    @ManyToOne(() => Game, (game) => game.usersGame)
    game: Game;
}