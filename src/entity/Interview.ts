import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Participant } from "./Participant";

export interface IInterview {
    id?: number,
    startDateTime: Date,
    endDateTime: Date,
}

@Entity("interview")
export class Interview implements IInterview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDateTime: Date;

    @Column()
    endDateTime: Date;

    @ManyToMany(() => Participant, ({ interviews }) => interviews)
    participants: Participant[];
}
