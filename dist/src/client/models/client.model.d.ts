import { Fila } from '@/fila/models/fila.model';
export declare class Client {
    id: number;
    name: string;
    telefone: string;
    fila: Fila;
    position: number;
    lastFilaId: string;
    entryTime: Date;
    exitTime?: Date;
}
