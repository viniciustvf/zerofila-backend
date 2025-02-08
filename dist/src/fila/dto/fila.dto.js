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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilaDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FilaDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, max: { required: true, type: () => Number }, url: { required: true, type: () => String }, status: { required: true, type: () => Boolean }, empresaId: { required: true, type: () => Number }, clientIds: { required: true, type: () => [Number] }, calledClientId: { required: true, type: () => Number, nullable: true } };
    }
}
exports.FilaDto = FilaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome da fila',
        example: 'Fila de Atendimento',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilaDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número máximo de pessoas na fila',
        example: 100,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilaDto.prototype, "max", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL da fila para acesso',
        example: 'http://example.com/fila',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilaDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da fila Ativo = True ou Inativo = False',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilaDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID da empresa associada à fila',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilaDto.prototype, "empresaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IDs dos clientes associados à fila',
        example: [1, 2, 3],
    }),
    __metadata("design:type", Array)
], FilaDto.prototype, "clientIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cliente atualmente em atendimento',
    }),
    __metadata("design:type", Number)
], FilaDto.prototype, "calledClientId", void 0);
//# sourceMappingURL=fila.dto.js.map