import { Empresa } from '@/empresa/models/empresa.model';
import { Client } from '@/client/models/client.model';
export declare class Fila {
    id: number;
    name: string;
    max: number;
    url: string;
    status: boolean;
    empresa: Empresa;
    clients: Client[];
    calledClient: Client | null;
}
