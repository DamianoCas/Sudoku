import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm"
import * as bcrypt from 'bcrypt'
import { UsersGames } from "./UsersGames";
import { IsEmail, IsNotEmpty } from "class-validator"

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    @IsNotEmpty({ message: 'The username is required' })
    userName: string;
    
    @Column({ unique: true })
    @IsEmail({}, { message: 'Incorrect format' })
    @IsNotEmpty({ message: 'The email is required' })
    eMail: string;
    
    @Column()
    @IsNotEmpty({ message: 'The password is required' })
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
