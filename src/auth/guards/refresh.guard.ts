import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class RefreshGuard implements CanActivate{
    constructor(private jwtService: JwtService){}

    async canActivate(
        context: ExecutionContext
        ): Promise<boolean> {
            const request = context.switchToHttp().getRequest();
            const token = this.extractToken(request);
            if(!token) throw new UnauthorizedException()
            try {
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: process.env.JWT_REFRESH_TOKEN
            })
            request['user'] = payload;
            } catch (error) {
                throw new UnauthorizedException()
            }
            return true;
    }

    private extractToken(req: Request) {
        const [type, token] = req.headers.authorization.split(' ') ?? [];
        return type === 'Refresh' ? token : undefined;
    }
}