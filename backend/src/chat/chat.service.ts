import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { AskPetAiDto } from './dto/ask-pet-ai.dto';

@Injectable()
export class ChatService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';

    if (!this.apiKey) {
      console.error(
        '[ChatService] OPENAI_API_KEY is missing or empty. Please set it in .env',
      );
    } else {
      console.log(
        '[ChatService] OPENAI_API_KEY loaded, length =',
        this.apiKey.length,
      );
    }
  }

  async ask(dto: AskPetAiDto, ownerId?: number) {
    if (!this.apiKey) {
      throw new InternalServerErrorException('AI service is not configured');
    }

    const systemPrompt = `
Bạn là "VNU Pet AI Assistant", trợ lý ảo cho phòng khám thú cưng.
Nhiệm vụ:
- Giải thích ngắn gọn, dễ hiểu về sức khỏe, dinh dưỡng, tiêm phòng, hành vi thú cưng.
- Không kê đơn thuốc, không cho liều lượng cụ thể.
- Nếu triệu chứng nguy hiểm (co giật, khó thở, bỏ ăn > 24h, nôn nhiều, tiêu chảy nặng...), phải khuyên chủ nuôi đưa thú cưng đi khám ngay.
- Trả lời bằng đúng ngôn ngữ của người dùng (nếu người dùng hỏi tiếng Việt thì trả lời tiếng Việt).
    `.trim();

    const userMessage = dto.message;

    try {
      const response = await axios.post<any>(
        this.baseUrl,
        {
          model: 'gpt-4.1-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ownerId
              ? {
                  role: 'system',
                  content: `Người dùng hiện tại có ownerId = ${ownerId}. Nếu họ nói "thú cưng của tôi" thì đó là thú cưng trong hồ sơ của họ.`,
                }
              : undefined,
            { role: 'user', content: userMessage },
          ].filter(Boolean),
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const reply =
        response.data?.choices?.[0]?.message?.content?.trim() ||
        'Xin lỗi, hiện tôi chưa thể trả lời câu hỏi này.';

      return { reply };
    } catch (error: any) {
      console.error(
        '[ChatService] Error calling OpenAI:',
        error?.response?.status,
        error?.response?.data || error.message,
      );

      throw new InternalServerErrorException('Failed to call AI service');
    }
  }
}
