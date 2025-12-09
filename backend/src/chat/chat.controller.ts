import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AskPetAiDto } from './dto/ask-pet-ai.dto';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';


@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  async ask(@Body() dto: AskPetAiDto, @Req() req: any) {
    const ownerId = req.user?.sub || req.user?.id;
    return this.chatService.ask(dto, ownerId);
  }
}
