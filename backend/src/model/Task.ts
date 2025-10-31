import "reflect-metadata"; 
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Length, IsBoolean } from "class-validator";
import { User } from "./User"; 

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Length(3, 100)
    title!: string;

    @Column({ default: "" })
    description!: string;

    @Column({ default: false })
    @IsBoolean()
    completed!: boolean;

    @ManyToOne(() => User, (user: User) => user.tasks, { onDelete: "CASCADE" })
    user!: User;
}
