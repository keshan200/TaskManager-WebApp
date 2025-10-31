import "reflect-metadata"; 
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Length, IsBoolean } from "class-validator";
import { users } from "./User"; 

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

    @ManyToOne(() => users, (user: users) => user.tasks, { onDelete: "CASCADE" })
    user!: users;
}
