import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm"
import * as bcrypt from 'bcrypt'
import { UsersGames } from "./UsersGames";

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    userName: string;
    
    @Column({ unique: true })
    eMail: string;
    
    @Column()
    passwordHash: string;
    
    @Column()
    salt: string;
    
    @OneToMany(() => UsersGames, (userGames) => userGames.user)
    userGames: UsersGames[];
    
    
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.passwordHash) {
            this.salt = await bcrypt.genSalt();
            this.passwordHash = await bcrypt.hash(this.passwordHash, this.salt);
        }
    }
    
    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.passwordHash);
    }
}
