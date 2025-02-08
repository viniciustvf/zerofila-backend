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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const client_repository_interface_1 = require("./repositories/client.repository.interface");
const client_model_1 = require("./models/client.model");
const client_typeorm_repository_1 = require("./repositories/implementations/client.typeorm.repository");
const fila_repository_interface_1 = require("../fila/repositories/fila.repository.interface");
const fila_typeorm_repository_1 = require("../fila/repositories/implementations/fila.typeorm.repository");
let ClientService = class ClientService {
    constructor(clientRepository, filaRepository) {
        this.clientRepository = clientRepository;
        this.filaRepository = filaRepository;
    }
    async findAll() {
        return await this.clientRepository.findAll();
    }
    async findById(clientId) {
        const client = await this.clientRepository.findById(clientId);
        if (!client) {
            throw new common_1.NotFoundException(`Client #${clientId} not found`);
        }
        return client;
    }
    async createClient(clientDto) {
        const fila = await this.filaRepository.findById(clientDto.filaId.toString());
        if (!fila) {
            throw new common_1.NotFoundException(`Fila com ID ${clientDto.filaId} não encontrada.`);
        }
        const client = new client_model_1.Client();
        client.name = clientDto.name;
        client.telefone = clientDto.telefone;
        client.fila = fila;
        return this.clientRepository.create(client);
    }
    async updateClient(id, clientUpdateDto) {
        const fila = await this.filaRepository.findById(clientUpdateDto?.filaId.toString());
        const client = new client_model_1.Client();
        client.name = clientUpdateDto.name;
        client.telefone = clientUpdateDto.telefone;
        client.fila = fila;
        try {
            return await this.clientRepository.updateClient(id, client);
        }
        catch (err) {
            throw new common_1.BadRequestException('Client not updated');
        }
    }
    async deleteClient(id) {
        const client = await this.findById(id);
        return await this.clientRepository.deleteClient(client);
    }
    async findClientsByEmpresaAndDate(empresaId, startDate, endDate) {
        return await this.clientRepository.findClientsByEmpresaAndDate(empresaId, startDate, endDate);
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(client_repository_interface_1.CLIENT_REPOSITORY_TOKEN)),
    __param(1, (0, common_1.Inject)(fila_repository_interface_1.FILA_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [client_typeorm_repository_1.ClientTypeOrmRepository,
        fila_typeorm_repository_1.FilaTypeOrmRepository])
], ClientService);
//# sourceMappingURL=client.service.js.map