import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @UseGuards(JwtGuard)
    @Get(':id')
    async getUserById(@Param('id') id: string){
        return await this.userService.findById(id)
    }
}
