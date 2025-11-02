import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/staff')
  @ApiOperation({ summary: 'Staff login' })
  loginStaff(@Body() loginDto: LoginDto) {
    return this.authService.loginStaff(loginDto);
  }

  @Post('login/owner')
  @ApiOperation({ summary: 'Pet owner login' })
  loginOwner(@Body() loginDto: LoginDto) {
    return this.authService.loginOwner(loginDto);
  }
}