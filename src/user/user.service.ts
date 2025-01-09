import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { hash } from 'bcrypt';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepo:Repository<User>){}

    async create(dto:CreateUserDto){
        const user = await this.userRepo.findOneBy({ email: dto.email })
        if(user) throw new ConflictException('This email is already exist');

        const encryptPassword = await hash(dto.password, 10);

        const newUser = await this.userRepo.create({
            ...dto,
            password: encryptPassword
        })
        const createdUser = await this.userRepo.save(newUser)

        return {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email
        }
    }

    async findByEmail(email: string){
        const user = await this.userRepo.findOneBy({ email })
        return user;
    }

    async findById(id: string){
        const user = await this.userRepo.findOneBy({ id })
        if(user){
            return {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
        throw new BadRequestException('User dosn`t exists!')
    }
}
