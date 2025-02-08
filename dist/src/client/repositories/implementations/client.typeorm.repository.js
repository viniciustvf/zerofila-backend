"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientTypeOrmRepository = void 0;
const typeorm_1 = require("typeorm");
class ClientTypeOrmRepository {
    constructor(clientRepository, hashingService) {
        this.clientRepository = clientRepository;
        this.hashingService = hashingService;
    }
    async findClientsByEmpresaAndDate(empresaId, startDate, endDate) {
        const queryBuilder = this.clientRepository
            .createQueryBuilder('client')
            .innerJoin('client.fila', 'fila')
            .innerJoin('fila.empresa', 'empresa')
            .where('empresa.id = :empresaId', { empresaId })
            .andWhere('client.entryTime BETWEEN :startDate AND :endDate', { startDate, endDate })
            .orderBy('client.entryTime', 'ASC');
        const [sql, parameters] = queryBuilder.getQueryAndParameters();
        console.log('📌 SQL Gerado:', sql);
        console.log('📌 Parâmetros:', parameters);
        return await queryBuilder.getMany();
    }
    async findByLastFilaId(lastFilaId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date();
        tomorrow.setHours(23, 59, 59, 999);
        return await this.clientRepository.find({
            where: {
                lastFilaId: lastFilaId,
                entryTime: (0, typeorm_1.Between)(today, tomorrow),
            },
        });
    }
    async findAll() {
        return await this.clientRepository.find();
    }
    async findById(clientId) {
        return await this.clientRepository.findOneBy({
            id: +clientId,
        });
    }
    async findByFilaId(filaId) {
        return await this.clientRepository.find({
            where: { fila: { id: filaId } },
            relations: ['fila'],
        });
    }
    async create(client) {
        return await this.clientRepository.save(client);
    }
    async updateClient(id, client) {
        console.log(client);
        return await this.clientRepository.update({
            id: +id,
        }, { ...client });
    }
    async deleteClient(Client) {
        await this.clientRepository.remove(Client);
    }
}
exports.ClientTypeOrmRepository = ClientTypeOrmRepository;
//# sourceMappingURL=client.typeorm.repository.js.map