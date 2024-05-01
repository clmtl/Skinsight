import { ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { RequestType } from 'src/types/Request.type';

const selectAllFieldsWithoutPassword = {
  id: true,
  email: true,
  role: true,
  first_name: true,
  last_name: true,
  gender: true,
  phone_number: true,
  birth_date: true,
  doctor_adeli: true,
  created_at: true,
  updated_at: true
}


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({select: selectAllFieldsWithoutPassword});
    if (!users) throw new NotFoundException(`Users not found`);
    return users;
  }

  async findMany(request: RequestType) {    
    const role = request.user.role;
    if (role === 'patient') {
      const users = await this.userRepository.find({ where: { role: Not('patient') }, select: selectAllFieldsWithoutPassword, relations: ['consultations', 'appointments'] });
      if (!users) throw new NotFoundException(`Users not found`);
      const doctors = [];
      const dermatologists = [];
      users.forEach(user => {
        if (user.role === "doctor") {
          doctors.push(user);
        } else if (user.role === "dermatologist") {
          dermatologists.push(user);
        }
      });
      return {doctors, dermatologists};
    } else if (role === "doctor") {
      const users = await this.userRepository.find({ where: { role: Not('doctor') }, select: selectAllFieldsWithoutPassword, relations: ['consultations', 'appointments'] });
      if (!users) throw new NotFoundException(`Users not found`);
      const patients = [];
      const dermatologists = [];
      users.forEach(user => {
        if (user.role === "patient") {
          patients.push(user);
        } else if (user.role === "dermatologist") {
          dermatologists.push(user);
        }
      });
      return {patients, dermatologists};
    } else if (role === "dermatologist") {
      const users = await this.userRepository.find({ where: { role: Not('dermatologist') }, select: selectAllFieldsWithoutPassword, relations: ['consultations', 'appointments'] });
      if (!users) throw new NotFoundException(`Users not found`);
      const patients = [];
      const doctors = [];
      users.forEach(user => {
        if (user.role === "patient") {
          patients.push(user);
        } else if (user.role === "doctor") {
          doctors.push(user);
        }
      });
      return {patients, doctors};
    } else {
      throw new NotFoundException(`User role not found`);
    }
  }

  async findOne(id: number, needPassword = false) {
    if (needPassword) {
      const user = await this.userRepository.findOne({ where: { id }, relations: ['skin_images', 'skin_images.ai_analysis', 'consultations', 'appointments', 'documents'] });
      if (!user) throw new NotFoundException(`User #${id} not found`);
      return user;
    }
    const user = await this.userRepository.findOne({ where: { id }, select: selectAllFieldsWithoutPassword, relations: ['skin_images', 'skin_images.ai_analysis', 'consultations', 'appointments', 'documents'] });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['skin_images', 'skin_images.ai_analysis', 'consultations', 'appointments', 'documents'] });
    if (!user) throw new NotFoundException(`User #${email} not found`);
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {password} = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({...createUserDto, password: hashedPassword});
    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {    
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const savedUser = await this.userRepository.save(user);
    if (savedUser.password) delete savedUser.password;
    return savedUser;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}