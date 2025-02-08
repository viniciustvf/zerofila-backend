import { Client } from "@/client/models/client.model";
import { Empresa } from "@/empresa/models/empresa.model";
export declare class Fila {
    id: string;
    name: string;
    max: Number;
    url: string;
    status: boolean;
    empresa: Empresa;
    clients: Client[];
    calledClient: Client;
    constructor(id: string, name: string, max: Number, url: string, status: boolean, empresa: Empresa, clients: Client[], calledClient: Client);
}
