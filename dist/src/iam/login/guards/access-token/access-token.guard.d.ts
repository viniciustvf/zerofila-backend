import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
export declare class AccessTokenGuard implements CanActivate {
    private readonly jwtService;
    private readonly jwtConfiguration;
    constructor(jwtService: JwtService, jwtConfiguration: ConfigType<typeof jwtConfig>);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
