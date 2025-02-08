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
exports.FilaController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const fila_service_1 = require("./fila.service");
const fila_update_dto_1 = require("./dto/fila-update.dto");
const fila_dto_1 = require("./dto/fila.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_decorator_1 = require("../iam/login/decorators/auth-guard.decorator");
const auth_type_enum_1 = require("../iam/login/enums/auth-type.enum");
let FilaController = class FilaController {
    constructor(filaService) {
        this.filaService = filaService;
    }
    async findAllFila(empresaId) {
        return this.filaService.findAll(empresaId);
    }
    async findOneFila(filaId) {
        return this.filaService.findById(filaId);
    }
    async findByIdWithRelations(filaId) {
        return this.filaService.findByIdWithRelations(filaId);
    }
    async createFila(filaDto) {
        try {
            console.log(filaDto);
            await this.filaService.createFila(filaDto);
            return {
                message: 'Fila created successfully!',
                status: common_1.HttpStatus.CREATED,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err, 'Error: Fila not created!');
        }
    }
    async updateFila(filaId, filaUpdateDto) {
        try {
            await this.filaService.updateFila(filaId, filaUpdateDto);
            return {
                message: 'fila Updated successfully!',
                status: common_1.HttpStatus.OK,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err, 'Error: fila not updated!');
        }
    }
    async deleteFila(filaId) {
        await this.filaService.deleteFila(filaId);
    }
    async validateHash(body) {
        try {
            const { hash } = body;
            if (!hash) {
                throw new common_1.BadRequestException('Hash are required');
            }
            const isValid = await this.filaService.validateHash(hash);
            if (isValid) {
                return { isValid: true, message: 'Hash is valid' };
            }
            else {
                return { isValid: false, message: 'Hash is invalid or expired' };
            }
        }
        catch (err) {
            throw new common_1.BadRequestException(err, 'Error validating hash!');
        }
    }
    async checkClientInQueue(telefone, filaId) {
        try {
            if (!telefone || !filaId) {
                throw new common_1.BadRequestException('Telefone e Fila ID são obrigatórios.');
            }
            const client = await this.filaService.findClientInQueue(telefone, filaId);
            return { exists: !!client, client };
        }
        catch (error) {
            console.error('Erro no checkClientInQueue:', error);
            throw error;
        }
    }
    async getEstimatedTime(filaId) {
        return this.filaService.getEstimatedWaitTime(filaId);
    }
};
exports.FilaController = FilaController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all fila from a specific company',
    }),
    openapi.ApiResponse({ status: 200, type: [require("./models/fila.model").Fila] }),
    __param(0, (0, common_1.Query)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilaController.prototype, "findAllFila", null);
__decorate([
    (0, common_1.Get)('/:filaId'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get a fila by id',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ status: 400, description: 'fila not found' }),
    openapi.ApiResponse({ status: 200, type: require("./models/fila.model").Fila }),
    __param(0, (0, common_1.Param)('filaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilaController.prototype, "findOneFila", null);
__decorate([
    (0, common_1.Get)('findByIdWithRelations/:filaId'),
    (0, auth_guard_decorator_1.Public)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get a fila by id',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ status: 400, description: 'fila not found' }),
    openapi.ApiResponse({ status: 200, type: require("./models/fila.model").Fila }),
    __param(0, (0, common_1.Param)('filaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilaController.prototype, "findByIdWithRelations", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({
        status: 201,
        description: 'Fila created successfully',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ status: 400, description: 'Invalid data' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fila_dto_1.FilaDto]),
    __metadata("design:returntype", Promise)
], FilaController.prototype, "createFila", null);
__decorate([
    (0, common_1.Put)('/:filaId'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Update a fila by id',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ status: 400, description: 'fila not updated' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('filaId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fila_update_dto_1.FilaUpdateDto]),
    __metadata("design:returntype", Promise)
], FilaController.prototype, "updateFila", null);
__decorate([
    (0, common_1.Delete)('/:filaId'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete a fila by id',
    }),
    (0, swagger_1.ApiNoContentResponse)({ status: 404, description: 'fila not deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('filaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilaController.prototype, "deleteFila", null);
__decorate([
    (0, common_1.Post)('/validate-hash'),
    (0, auth_guard_decorator_1.Public)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Validate hash successfully',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ status: 400, description: 'Invalid hash or parameters' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilaController.prototype, "validateHash", null);
__decorate([
    (0, common_1.Get)('check-client'),
    (0, auth_guard_decorator_1.Public)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('telefone')),
    __param(1, (0, common_1.Query)('filaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FilaController.prototype, "checkClientInQueue", null);
__decorate([
    (0, common_1.Get)(':filaId/estimated-time'),
    (0, auth_guard_decorator_1.Public)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('filaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilaController.prototype, "getEstimatedTime", null);
exports.FilaController = FilaController = __decorate([
    (0, swagger_1.ApiTags)('fila'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, auth_guard_decorator_1.AuthGuard)(auth_type_enum_1.AuthType.Bearer),
    (0, common_1.Controller)('fila'),
    __metadata("design:paramtypes", [fila_service_1.FilaService])
], FilaController);
//# sourceMappingURL=fila.controller.js.map