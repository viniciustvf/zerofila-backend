"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilaTypeOrmRepository = void 0;
class FilaTypeOrmRepository {
    constructor(filaRepository, hashingService) {
        this.filaRepository = filaRepository;
        this.hashingService = hashingService;
    }
    async findAll() {
        return await this.filaRepository.find();
    }
    async findById(filaId) {
        return await this.filaRepository.findOneBy({
            id: +filaId,
        });
    }
    async findByIdWithRelations(filaId) {
        return await this.filaRepository
            .createQueryBuilder('fila')
            .leftJoinAndSelect('fila.clients', 'client')
            .leftJoinAndSelect('fila.calledClient', 'calledClient')
            .leftJoinAndSelect('fila.empresa', 'empresa')
            .where('fila.id = :filaId', { filaId })
            .getOne();
    }
    async findClientCalledByFilaId(filaId) {
        return await this.filaRepository
            .createQueryBuilder('fila')
            .leftJoinAndSelect('fila.calledClient', 'calledClient')
            .where('fila.id = :filaId', { filaId })
            .getOne();
    }
    async findAllByEmpresaId(empresaId) {
        const filas = await this.filaRepository.find({
            where: { empresa: { id: empresaId } },
            relations: ['empresa', 'clients', 'calledClient'],
        });
        return filas.map((fila) => ({
            ...fila,
            qtdClients: fila.clients ? fila.clients.length : 0,
        }));
    }
    async create(fila) {
        return await this.filaRepository.save(fila);
    }
    async updateFila(id, fila) {
        return await this.filaRepository.update({
            id: +id,
        }, { ...fila });
    }
    async deleteFila(Fila) {
        await this.filaRepository.remove(Fila);
    }
}
exports.FilaTypeOrmRepository = FilaTypeOrmRepository;
//# sourceMappingURL=fila.typeorm.repository.js.map