import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
        ){}

    async validateUser(dto: LoginDto){
        const user = await this.userService.findByEmail(dto.email);
        if(user){
            const isCorrectPassword = await compare(dto.password, user.password);
            if (isCorrectPassword){
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            }
            throw new UnauthorizedException('Email or Password is incorrect!')
        }
        throw new UnauthorizedException('Email is not register!')
    }

    async logInUser(dto: LoginDto){
        const user = await this.validateUser(dto)
        const payload = {
            email: user.email,
            name: user.name,
            id: user.id
        }
        const accessToken = await this.jwtService.signAsync(payload,{
            expiresIn: '1h',
            secret: process.env.JWT_SECRET_KEY
        })

        const refreshToken = await this.jwtService.signAsync(payload,{
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_TOKEN
        })

        return {
            user,
            backendTokens: {
                accessToken,
                refreshToken
            }
        }
    }
}
