import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express'; // ✅ Atualizado para Express
import { REQUEST_EMPRESA_KEY, TYPE_TOKEN_BEARER } from '../../../iam.constants';
import jwtConfig from '../../config/jwt.config';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); // ✅ Express Request
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );

      // ✅ Solução para erro TS7053: Forçamos o TypeScript a aceitar o índice dinâmico
      (request as any)[REQUEST_EMPRESA_KEY] = payload;

    } catch (err) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, err);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === TYPE_TOKEN_BEARER ? token : undefined;
  }
}