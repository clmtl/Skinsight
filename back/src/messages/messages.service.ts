import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/users/entities/user.entity';
import { RequestType } from 'src/types/Request.type';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async findAll(request: RequestType) {
        const messages = await this.messageRepository.find({ where: [
            { sender_id: request.user.id },
            { receiver_id: request.user.id }
            ],
            relations: ['sender', 'receiver'] });
        return messages;
    }

    async findOne(id: number) {
        const message = await this.messageRepository.findOne({ where: { id }, relations: ['sender', 'receiver'] });
        return message;
    }

    async findConversationByUsers(user1: number, user2: number) {   
        const messages = await this.messageRepository.find({ where: [
            { sender_id: user1, receiver_id: user2 },
            { sender_id: user2, receiver_id: user1 }
        ],
        order: {
            created_at: 'ASC'
        },
        relations: ['sender', 'receiver'] });
        return messages;
    }

    async findUserConversations(userId: number) {
        const messages = await this.messageRepository.find({ where: [
            { sender_id: userId },
            { receiver_id: userId }
        ],
        relations: ['sender', 'receiver'] });
        if (messages.length === 0) return [];

        const conversations: {user1: number, user2: number}[] = []; // each conversation is unique
        messages.forEach((message) => {
            const senderId = message.sender_id;
            const receiverId = message.receiver_id;
            const conversation = {user1: senderId, user2: receiverId};
            const conversationExists = conversations.some((conversation) => {
                return (conversation.user1 === senderId && conversation.user2 === receiverId) || (conversation.user1 === receiverId && conversation.user2 === senderId);
            });
            if (!conversationExists) conversations.push(conversation);

        });

        const arrayOfConversations = conversations.map((conversation) => {
            return [conversation.user1, conversation.user2];
        });
        
        return arrayOfConversations;
    }

    create(request: RequestType, data: {receiver_id: number, message_text: string}) {
        const createMessageDto: CreateMessageDto = {
            sender_id: request.user.id,
            receiver_id: data.receiver_id,
            message_text: data.message_text
        };
        const message = this.messageRepository.create(createMessageDto);
        return this.messageRepository.save(message);
    }

    async update(id: number, request: RequestType, updateMessageDto: UpdateMessageDto) {
        const message = await this.messageRepository.preload({
        id: +id,
        ...updateMessageDto,
        });
        if (!message) {
            throw new NotFoundException(`Message #${id} not found`);
        }
        if (message.sender_id !== request.user.id && request.user.role !== "admin") {
            throw new NotFoundException(`User can't delete this message`);
        }
        return this.messageRepository.save(message);
    }

    async remove(id: number, request: RequestType) {
        const message = await this.findOne(id);
        if (!message) {
            throw new NotFoundException(`Message #${id} not found`);
        }
        if (message.sender_id !== request.user.id && request.user.role !== "admin") {
            throw new NotFoundException(`User can't delete this message`);
        }
        return this.messageRepository.remove(message);
    }
}
