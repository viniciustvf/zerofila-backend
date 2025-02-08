"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilaUpdateDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const fila_dto_1 = require("./fila.dto");
class FilaUpdateDto extends (0, swagger_1.PartialType)(fila_dto_1.FilaDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.FilaUpdateDto = FilaUpdateDto;
//# sourceMappingURL=fila-update.dto.js.map