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
exports.Fila = void 0;
const empresa_model_1 = require("../../empresa/models/empresa.model");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const client_model_1 = require("../../client/models/client.model");
let Fila = class Fila {
};
exports.Fila = Fila;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identificador único da fila',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Fila.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome da fila',
        example: 'Fila de Atendimento',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Fila.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número máximo de pessoas permitidas na fila',
        example: 100,
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Fila.prototype, "max", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL associada à fila para acesso',
        example: 'http://example.com/fila',
        maxLength: 60,
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Fila.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da fila Ativo = True ou Inativo = False',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Fila.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Empresa associada à fila',
        type: () => empresa_model_1.Empresa,
    }),
    (0, typeorm_1.ManyToOne)(() => empresa_model_1.Empresa, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'empresaId' }),
    __metadata("design:type", empresa_model_1.Empresa)
], Fila.prototype, "empresa", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clientes associados à fila',
        type: () => client_model_1.Client,
    }),
    (0, typeorm_1.OneToMany)(() => client_model_1.Client, (client) => client.fila),
    __metadata("design:type", Array)
], Fila.prototype, "clients", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cliente atualmente em atendimento',
        type: () => client_model_1.Client,
    }),
    (0, typeorm_1.OneToOne)(() => client_model_1.Client, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", client_model_1.Client)
], Fila.prototype, "calledClient", void 0);
exports.Fila = Fila = __decorate([
    (0, typeorm_1.Entity)()
], Fila);
//# sourceMappingURL=fila.model.js.map