"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilaGateway = void 0;
const client_model_1 = require("../client/models/client.model");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const fila_repository_interface_1 = require("./repositories/fila.repository.interface");
const fila_typeorm_repository_1 = require("./repositories/implementations/fila.typeorm.repository");
const client_repository_interface_1 = require("../client/repositories/client.repository.interface");
const client_typeorm_repository_1 = require("../client/repositories/implementations/client.typeorm.repository");
let FilaGateway = class FilaGateway {
    constructor(filaRepository, clientRepository) {
        this.filaRepository = filaRepository;
        this.clientRepository = clientRepository;
    }
    async sendQueueUpdate(fila) {
        try {
            if (!fila)
                return;
            const sortedClients = fila.clients.sort((a, b) => a.position - b.position);
            this.server.to(fila.id.toString()).emit('queueUpdate', sortedClients);
        }
        catch (error) {
            console.error('Erro ao enviar atualização da fila:', error);
        }
    }
    handleJoinRoom(client, payload) {
        client.join(payload.filaId);
        client.emit('joinedRoom', `Você entrou na sala da fila ${payload.filaId}`);
        console.log(`Cliente ${client.id} entrou na sala da fila ${payload.filaId}`);
    }
    async leaveQueue(data, socket) {
        const { filaId, telefone } = data;
        try {
            const fila = await this.filaRepository.findByIdWithRelations(filaId);
            if (!fila || !fila.clients || fila.clients.length === 0) {
                socket.emit('error', { message: 'Fila não encontrada ou vazia' });
                return;
            }
            const clientIndex = fila.clients.findIndex(client => client.telefone === telefone);
            if (clientIndex === -1) {
                socket.emit('error', { message: 'Cliente não encontrado na fila' });
                return;
            }
            const removedClient = fila.clients[clientIndex];
            removedClient.fila = null;
            await this.clientRepository.create(removedClient);
            fila.clients.splice(clientIndex, 1);
            fila.clients.forEach((client, index) => {
                client.position = index + 1;
            });
            await Promise.all(fila.clients.map(client => this.clientRepository.create(client)));
            await this.filaRepository.create(fila);
            this.sendQueueUpdate(fila);
            socket.emit('success', { message: 'Você saiu da fila com sucesso' });
        }
        catch (error) {
            console.error('Erro ao remover cliente da fila:', error);
            socket.emit('error', { message: 'Erro ao processar a solicitação' });
        }
    }
    async joinQueue(clientData, socket) {
        const { filaId, name, telefone } = clientData;
        try {
            const fila = await this.filaRepository.findByIdWithRelations(filaId);
            if (!fila) {
                socket.emit('error', { message: 'Fila não encontrada' });
                return;
            }
            if (fila.clients.length >= fila.max) {
                console.warn(`Fila ${filaId} está cheia. Capacidade máxima: ${fila.max} pessoas.`);
                socket.emit('error', { message: 'Fila está cheia. Aguarde disponibilidade.' });
                return;
            }
            const position = fila.clients.length + 1;
            const client = new client_model_1.Client();
            client.name = name;
            client.telefone = telefone;
            client.fila = fila;
            client.position = position;
            client.lastFilaId = fila.id.toString();
            client.entryTime = new Date();
            await this.clientRepository.create(client);
            const updatedFila = await this.filaRepository.findByIdWithRelations(filaId);
            socket.join(filaId);
            this.sendQueueUpdate(updatedFila);
        }
        catch (error) {
            console.error('Erro ao adicionar cliente à fila:', error);
            socket.emit('error', { message: 'Erro ao processar sua solicitação' });
        }
    }
    async viewQueue(data, socket) {
        const { filaId } = data;
        try {
            const fila = await this.filaRepository.findByIdWithRelations(filaId);
            if (!fila) {
                socket.emit('error', { message: 'Fila não encontrada' });
                return;
            }
            socket.join(filaId);
            await this.sendQueueUpdate(fila);
        }
        catch (error) {
            console.error('Erro ao visualizar a fila:', error);
            socket.emit('error', { message: 'Erro ao processar sua solicitação' });
        }
    }
    async handleCallNextClient(filaId) {
        try {
            const fila = await this.filaRepository.findByIdWithRelations(filaId);
            if (!fila || !fila.clients || fila.clients.length === 0) {
                return;
            }
            const calledClient = fila.clients.shift();
            if (calledClient) {
                calledClient.exitTime = new Date();
                fila.calledClient = calledClient;
                calledClient.fila = null;
                await this.clientRepository.create(calledClient);
            }
            await Promise.all(fila.clients.map((client, index) => {
                client.position = index + 1;
                return this.clientRepository.create(client);
            }));
            await this.filaRepository.create(fila);
            this.server.to(filaId).emit('clientCalled', calledClient);
            this.sendQueueUpdate(fila);
        }
        catch (error) {
            console.error('Erro ao adicionar cliente à fila:', error);
        }
    }
    async notifyQueueUrlUpdate(filaId, updatedUrl) {
        try {
            this.server.to(filaId).emit('queueUrlUpdated', { filaId, url: updatedUrl });
        }
        catch (error) {
            console.error(`Erro ao emitir evento:`, error);
        }
    }
};
exports.FilaGateway = FilaGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], FilaGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], FilaGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveQueue'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], FilaGateway.prototype, "leaveQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinQueue'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], FilaGateway.prototype, "joinQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('viewQueue'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], FilaGateway.prototype, "viewQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('callNextClient'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilaGateway.prototype, "handleCallNextClient", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('queueUrlUpdated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FilaGateway.prototype, "notifyQueueUrlUpdate", null);
exports.FilaGateway = FilaGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(4000, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    }),
    __param(0, (0, common_1.Inject)(fila_repository_interface_1.FILA_REPOSITORY_TOKEN)),
    __param(1, (0, common_1.Inject)(client_repository_interface_1.CLIENT_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [fila_typeorm_repository_1.FilaTypeOrmRepository,
        client_typeorm_repository_1.ClientTypeOrmRepository])
], FilaGateway);
//# sourceMappingURL=fila.gateway.js.map