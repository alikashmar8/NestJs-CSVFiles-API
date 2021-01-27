import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
const jwt = require('jsonwebtoken');
@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        var token = request.headers.token;
        if (!token) {
            return false;
        }

        try {
            var verified = jwt.verify(token, 'secret');
            request.token = verified;
            return true;
        }
        catch (err) {
            throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
        }
    };
}
