import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./Task";
import { IsEmail, Length } from "class-validator";

@Entity()
export class users {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Length(3, 50)
    name!: string;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column()
    @Length(6, 100)
    password!: string;

    @OneToMany(() => Task, task => task.user)
    tasks!: Task[];
}
