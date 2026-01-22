export interface Session {
    id: string;
    title: string;
    duration: number;
    date: string;
    description?: string;
    isCompleted: boolean;
}

export type SessionInput = Omit<Session, 'id'|'date'|'isCompleted'>;