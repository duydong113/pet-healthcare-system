import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { AskPetAiDto } from './dto/ask-pet-ai.dto';

@Injectable()
export class ChatService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl =
      process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

    if (!this.apiKey) {
      console.error(
        '[ChatService] OPENROUTER_API_KEY is missing or empty. Please set it in .env',
      );
    } else {
      console.log(
        '[ChatService] OPENROUTER_API_KEY loaded, length =',
        this.apiKey.length,
      );
    }
  }

  async ask(dto: AskPetAiDto, ownerId?: number) {
    if (!this.apiKey) {
      throw new InternalServerErrorException('AI service is not configured');
    }

    const systemPrompt = `
Bạn là "PawPerfect AI Assistant", trợ lý ảo cho phòng khám thú cưng.
Nhiệm vụ:
- Giải thích ngắn gọn, dễ hiểu về sức khỏe, dinh dưỡng, tiêm phòng, hành vi thú cưng.
- Không kê đơn thuốc, không cho liều lượng cụ thể.
- Nếu triệu chứng nguy hiểm (co giật, khó thở, bỏ ăn > 24h, nôn nhiều, tiêu chảy nặng...), phải khuyên chủ nuôi đưa thú cưng đi khám ngay.
- Trả lời bằng đúng ngôn ngữ của người dùng (nếu người dùng hỏi tiếng Việt thì trả lời tiếng Việt).
    `.trim();

    const userMessage = dto.message;

    try {
      const response = await axios.post<any>(
        `${this.baseUrl}/chat/completions`,
        {
          // OpenRouter sẽ chọn model phù hợp
          model: 'openrouter/auto',
          messages: [
            { role: 'system', content: systemPrompt },
            ownerId
              ? {
                  role: 'system',
                  content: `Người dùng hiện tại có ownerId = ${ownerId}. Nếu họ nói "thú cưng của tôi" thì đó là thú cưng thuộc hồ sơ của họ trong hệ thống.`,
                }
              : undefined,
            { role: 'user', content: userMessage },
          ].filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            // Hai header này OpenRouter khuyến khích, có cũng tốt
            'HTTP-Referer': 'http://localhost:3001', // đổi thành URL frontend nếu muốn
            'X-Title': 'VNU Pet Healthcare Assistant',
          },
        },
      );

      const reply =
        response.data?.choices?.[0]?.message?.content?.trim() ||
        'Xin lỗi, hiện tôi chưa thể trả lời câu hỏi này.';

      return { reply };
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data || error.message;

      console.error('[ChatService] Error calling OpenRouter:', status, data);

      // Nếu lỗi do quota / rate limit
      if (status === 429) {
        return {
          reply:
            'Hiện tại trợ lý AI đang vượt quá giới hạn sử dụng trên tài khoản OpenRouter (quota/billing). ' +
            'Đây là hạn chế của dịch vụ AI, không phải lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ quản trị viên để nâng hạn mức.',
        };
      }

      // Các lỗi khác
      throw new InternalServerErrorException('Failed to call AI service');
    }
  }
}
