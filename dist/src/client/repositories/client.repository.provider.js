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
exports.ClientRepoDependenciesProvider = exports.configService = void 0;
exports.provideClientRepository = provideClientRepository;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const constants_1 = require("../../constants");
const typeorm_2 = require("typeorm");
const hashing_service_1 = require("../../shared/hashing/hashing.service");
const config_2 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const client_typeorm_repository_1 = require("./implementations/client.typeorm.repository");
const client_model_1 = require("../models/client.model");
const client_repository_interface_1 = require("./client.repository.interface");
(0, dotenv_1.config)();
exports.configService = new config_2.ConfigService();
function provideClientRepository() {
    return [
        {
            provide: client_repository_interface_1.CLIENT_REPOSITORY_TOKEN,
            useFactory: async (dependenciesProvider) => provideClientRepositoryFactory(dependenciesProvider),
            inject: [ClientRepoDependenciesProvider],
        },
        ClientRepoDependenciesProvider,
    ];
}
async function provideClientRepositoryFactory(dependenciesProvider) {
    await config_1.ConfigModule.envVariablesLoaded;
    switch (exports.configService.get('CLIENT_DATASOURCE')) {
        case constants_1.DataSource.TYPEORM:
            return new client_typeorm_repository_1.ClientTypeOrmRepository(dependenciesProvider.typeOrmRepository, dependenciesProvider.hashingService);
    }
}
let ClientRepoDependenciesProvider = class ClientRepoDependenciesProvider {
    constructor(typeOrmRepository, hashingService) {
        this.typeOrmRepository = typeOrmRepository;
        this.hashingService = hashingService;
    }
};
exports.ClientRepoDependenciesProvider = ClientRepoDependenciesProvider;
exports.ClientRepoDependenciesProvider = ClientRepoDependenciesProvider = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_model_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        hashing_service_1.HashingService])
], ClientRepoDependenciesProvider);
//# sourceMappingURL=client.repository.provider.js.map