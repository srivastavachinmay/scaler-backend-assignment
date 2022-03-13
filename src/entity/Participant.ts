import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Interview } from "./Interview";

export interface IParticipant {
    id: number,
    name: string,
    email: string,
    type: "Interviewer" | "Candidate"
}

@Entity("participant")
export class Participant implements IParticipant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, default: "N/A" })
    name: string;

    @Column({ nullable: false, default: "N/A" })
    email: string;

    @Column({ nullable: false, default: "N/A" })
    type: "Interviewer" | "Candidate";

    @ManyToMany(() => Interview, ({ participants }) => participants, {
        cascade: ['remove']
    })
    @JoinTable()
    interviews: Interview[];
}
