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
exports.FilaService = void 0;
const common_1 = require("@nestjs/common");
const fila_repository_interface_1 = require("./repositories/fila.repository.interface");
const fila_model_1 = require("./models/fila.model");
const fila_typeorm_repository_1 = require("./repositories/implementations/fila.typeorm.repository");
const empresa_repository_interface_1 = require("../empresa/repositories/empresa.repository.interface");
const empresa_typeorm_repository_1 = require("../empresa/repositories/implementations/empresa.typeorm.repository");
const fila_gateway_1 = require("./fila.gateway");
const crypto = require("crypto");
const schedule_1 = require("@nestjs/schedule");
const client_typeorm_repository_1 = require("../client/repositories/implementations/client.typeorm.repository");
const client_repository_interface_1 = require("../client/repositories/client.repository.interface");
let FilaService = class FilaService {
    constructor(filaRepository, clientRepository, empresaRepository, filaGateway) {
        this.filaRepository = filaRepository;
        this.clientRepository = clientRepository;
        this.empresaRepository = empresaRepository;
        this.filaGateway = filaGateway;
        this.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
        this.notifiedClients = new Set();
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
    }
    async findAll(empresaId) {
        return await this.filaRepository.findAllByEmpresaId(Number(empresaId));
    }
    async findById(filaId) {
        const fila = await this.filaRepository.findById(filaId);
        if (!fila) {
            throw new common_1.NotFoundException(`Fila #${filaId} not found`);
        }
        return fila;
    }
    async findByIdWithRelations(filaId) {
        const fila = await this.filaRepository.findByIdWithRelations(filaId);
        if (!fila) {
            throw new common_1.NotFoundException(`Fila #${filaId} not found`);
        }
        return fila;
    }
    async createFila(filaDto) {
        const empresa = await this.empresaRepository.findById(filaDto.empresaId.toString());
        if (!empresa) {
            throw new common_1.NotFoundException(`Empresa com ID ${filaDto.empresaId} não encontrada.`);
        }
        const fila = new fila_model_1.Fila();
        fila.name = filaDto.name;
        fila.max = filaDto.max;
        fila.url = filaDto.url;
        fila.status = filaDto.status;
        fila.empresa = empresa;
        const timestamp = Math.floor(Date.now() / 1000);
        const dataToHash = `${timestamp}`;
        const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
        const url = `&hash=${hash}:${timestamp}`;
        const createdFila = await this.filaRepository.create(fila);
        createdFila.url = `/client-queue-form?id=${createdFila.id}${url}`;
        await this.filaRepository.updateFila(createdFila.id.toString(), createdFila);
        return this.filaRepository.findById(createdFila.id.toString());
    }
    async validateHash(hash) {
        try {
            const [receivedHash, timestampStr] = hash.split(':');
            const timestamp = parseInt(timestampStr, 10);
            if (isNaN(timestamp)) {
                return false;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            const maxAgeInSeconds = 5 * 60;
            if (Math.abs(currentTime - timestamp) > maxAgeInSeconds) {
                return false;
            }
            const dataToHash = `${timestamp}`;
            const recalculatedHash = crypto.createHash('sha256').update(dataToHash).digest('hex');
            return receivedHash === recalculatedHash;
        }
        catch (error) {
            console.error('Error validating hash:', error);
            return false;
        }
    }
    async generateAndUpdateHash() {
        const timestamp = Math.floor(Date.now() / 1000);
        const dataToHash = `${timestamp}`;
        const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
        const newHash = `${hash}:${timestamp}`;
        const filas = await this.filaRepository.findAll();
        if (!filas || filas.length === 0) {
            console.log('Nenhuma fila encontrada para atualizar.');
            return;
        }
        let updatedUrl;
        for (const fila of filas) {
            updatedUrl = `/client-queue-form?id=${fila.id}&hash=${newHash}`;
            fila.url = updatedUrl;
            await this.filaRepository.updateFila(fila.id.toString(), fila);
            this.filaGateway.notifyQueueUrlUpdate(fila.id.toString(), updatedUrl);
        }
    }
    async checkQueueAndNotify() {
        console.log('🔍 Verificando a fila...');
        try {
            const filas = await this.filaRepository.findAll();
            if (!filas || filas.length === 0) {
                console.log('⚠ Nenhuma fila encontrada.');
                return;
            }
            for (const fila of filas) {
                const queue = await this.filaRepository.findByIdWithRelations(fila.id.toString());
                if (!queue || !queue.clients || queue.clients.length === 0) {
                    console.log(`⚠ A fila "${fila.name}" não possui clientes.`);
                    continue;
                }
                const nextInLine = queue.clients.find(cliente => cliente.position === 2);
                if (!nextInLine) {
                    console.log(`⚠ Nenhum cliente na posição 2 da fila "${fila.name}".`);
                    continue;
                }
                if (!nextInLine.telefone) {
                    console.warn(`⚠ Cliente na posição 2 da fila "${fila.name}" não possui um telefone válido.`);
                    continue;
                }
                if (!this.notifiedClients.has(nextInLine.telefone)) {
                    try {
                        this.notifiedClients.add(nextInLine.telefone);
                        console.log(`✅ Mensagem enviada para ${nextInLine.telefone}.`);
                    }
                    catch (error) {
                        console.error(`❌ Erro ao enviar mensagem para ${nextInLine.telefone}:`, error);
                    }
                }
            }
        }
        catch (error) {
            console.error('❌ Erro inesperado ao verificar as filas:', error);
        }
    }
    async sendSms(to, body) {
        try {
            const message = await this.twilioClient.messages.create({
                body,
                messagingServiceSid: this.messagingServiceSid,
                to,
            });
            console.log(`Mensagem enviada com sucesso: SID ${message.sid}`);
        }
        catch (error) {
            console.error('Erro ao enviar mensagem SMS:' + error);
            throw error;
        }
    }
    async updateFila(id, filaUpdateDto) {
        const empresa = await this.empresaRepository.findById(filaUpdateDto?.empresaId.toString());
        const fila = new fila_model_1.Fila();
        fila.name = filaUpdateDto.name;
        fila.max = filaUpdateDto.max;
        fila.url = filaUpdateDto.url;
        fila.empresa = empresa;
        try {
            return await this.filaRepository.updateFila(id, fila);
        }
        catch (err) {
            throw new common_1.BadRequestException('Fila not updated');
        }
    }
    async deleteFila(id) {
        const fila = await this.findById(id);
        return await this.filaRepository.deleteFila(fila);
    }
    async findClientInQueue(telefone, filaId) {
        try {
            if (!telefone || !filaId) {
                throw new common_1.BadRequestException('Telefone e Fila ID são obrigatórios.');
            }
            const fila = await this.filaRepository.findByIdWithRelations(filaId);
            if (!fila) {
                throw new common_1.NotFoundException(`Fila com ID ${filaId} não encontrada.`);
            }
            const client = fila.clients.find((c) => c.telefone === telefone);
            return client || null;
        }
        catch (error) {
            console.error('Erro ao buscar cliente na fila:', error);
            throw error;
        }
    }
    async getEstimatedWaitTime(filaId) {
        const attendedClients = await this.clientRepository.findByLastFilaId(filaId);
        const validClients = attendedClients.filter(client => client.exitTime);
        if (validClients.length === 0) {
            console.warn(`Nenhum cliente atendido encontrado para fila ${filaId}.`);
            return { estimatedTime: 0 };
        }
        const totalServiceTime = validClients.reduce((sum, client) => {
            if (!client.entryTime || !client.exitTime) {
                console.warn(`Cliente ${client.id} tem horários inválidos: entryTime=${client.entryTime}, exitTime=${client.exitTime}`);
                return sum;
            }
            const entryTime = new Date(client.entryTime);
            const exitTime = new Date(client.exitTime);
            if (isNaN(entryTime.getTime()) || isNaN(exitTime.getTime())) {
                console.error(`Erro ao converter datas para cliente ${client.id}: entryTime=${client.entryTime}, exitTime=${client.exitTime}`);
                return sum;
            }
            if (exitTime <= entryTime) {
                console.error(`Erro: exitTime (${exitTime}) é menor ou igual a entryTime (${entryTime}) para cliente ${client.id}`);
                return sum;
            }
            const serviceTime = (exitTime.getTime() - entryTime.getTime()) / 60000;
            console.log(`Cliente ${client.id}: Tempo de serviço calculado = ${serviceTime.toFixed(2)} minutos`);
            return sum + serviceTime;
        }, 0);
        if (totalServiceTime === 0) {
            console.warn(`Nenhum cliente teve um tempo de atendimento válido para calcular a média.`);
            return { estimatedTime: 0 };
        }
        const avgServiceTimePerClient = totalServiceTime / validClients.length;
        console.log(`Tempo médio por cliente: ${avgServiceTimePerClient.toFixed(2)} minutos`);
        const fila = await this.filaRepository.findByIdWithRelations(filaId);
        if (!fila || !fila.clients) {
            return { estimatedTime: 0 };
        }
        const estimatedTime = fila.clients.length * avgServiceTimePerClient;
        console.log(`Tempo estimado de espera para novos clientes: ${estimatedTime.toFixed(2)} minutos`);
        return { estimatedTime };
    }
};
exports.FilaService = FilaService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FilaService.prototype, "generateAndUpdateHash", null);
__decorate([
    (0, schedule_1.Cron)('*/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FilaService.prototype, "checkQueueAndNotify", null);
exports.FilaService = FilaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(fila_repository_interface_1.FILA_REPOSITORY_TOKEN)),
    __param(1, (0, common_1.Inject)(client_repository_interface_1.CLIENT_REPOSITORY_TOKEN)),
    __param(2, (0, common_1.Inject)(empresa_repository_interface_1.EMPRESA_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [fila_typeorm_repository_1.FilaTypeOrmRepository,
        client_typeorm_repository_1.ClientTypeOrmRepository,
        empresa_typeorm_repository_1.EmpresaTypeOrmRepository,
        fila_gateway_1.FilaGateway])
], FilaService);
//# sourceMappingURL=fila.service.js.map