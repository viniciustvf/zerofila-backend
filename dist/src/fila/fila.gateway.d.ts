import { Server, Socket } from 'socket.io';
import { FilaTypeOrmRepository } from './repositories/implementations/fila.typeorm.repository';
import { ClientTypeOrmRepository } from '@/client/repositories/implementations/client.typeorm.repository';
export declare class FilaGateway {
    private readonly filaRepository;
    private readonly clientRepository;
    server: Server;
    constructor(filaRepository: FilaTypeOrmRepository, clientRepository: ClientTypeOrmRepository);
    private sendQueueUpdate;
    handleJoinRoom(client: Socket, payload: {
        filaId: string;
    }): void;
    leaveQueue(data: {
        filaId: string;
        telefone: string;
    }, socket: Socket): Promise<void>;
    joinQueue(clientData: {
        filaId: string;
        name: string;
        telefone: string;
    }, socket: Socket): Promise<void>;
    viewQueue(data: {
        filaId: string;
    }, socket: Socket): Promise<void>;
    handleCallNextClient(filaId: string): Promise<void>;
    notifyQueueUrlUpdate(filaId: string, updatedUrl: string): Promise<void>;
}
