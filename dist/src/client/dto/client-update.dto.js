"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUpdateDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_dto_1 = require("./client.dto");
class ClientUpdateDto extends (0, swagger_1.PartialType)(client_dto_1.ClientDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.ClientUpdateDto = ClientUpdateDto;
//# sourceMappingURL=client-update.dto.js.map