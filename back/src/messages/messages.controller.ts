import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { RequestType } from 'src/types/Request.type';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth'
})
@ApiForbiddenResponse({ description: "Forbidden" })
@UseGuards(RoleGuard(['admin', 'doctor', 'dermatologist']))
@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    @ApiOkResponse({ description: "OK" })
    @ApiNotFoundResponse({ description: "Not Found" })
    findAll(@Request() request: RequestType) {
        return this.messagesService.findAll(request);
    }

    @Get(':id')
    @ApiOkResponse({ description: "OK" })
    @ApiNotFoundResponse({ description: "Not Found" })
    findOne(@Param('id') id: number) {
        return this.messagesService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ description: "Created" })
    @ApiBadRequestResponse({ description: "Bad Request" })
    create(@Request() request: RequestType, @Body() data: {receiver_id: number, message_text: string}) {    
        return this.messagesService.create(request, data);
    }

    @Post('conversation')
    @ApiCreatedResponse({ description: "Created" })
    @ApiBadRequestResponse({ description: "Bad Request" })
    findConversationByUsers(@Body() data: {users: number[]}) {
        const usersArray = data.users;
        return this.messagesService.findConversationByUsers(usersArray[0], usersArray[1]);
    }

    @Get('conversations')
    @ApiOkResponse({ description: "OK" })
    @ApiNotFoundResponse({ description: "Not Found" })
    findUserConversations(@Request() request: RequestType) {
        const userId = request.user.id;
        return this.messagesService.findUserConversations(userId);
    }

    @Patch(':id')
    @ApiOkResponse({ description: "OK" })
    @ApiNotFoundResponse({ description: "Not Found" })
    update(@Param('id') id: number,@Request() request: RequestType, @Body() updateMessageDto: UpdateMessageDto) {
        return this.messagesService.update(id, request, updateMessageDto);
    }

    @Delete(':id')
    @ApiOkResponse({ description: "OK" })
    @ApiNotFoundResponse({ description: "Not Found" })
    remove(@Param('id') id: number, @Request() request: RequestType) {
        return this.messagesService.remove(id, request);
    }
}
