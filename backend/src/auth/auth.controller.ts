// src/auth/auth.controller.ts
import { Controller, Post, Get, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto, ChangePasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new patient account' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Login with email and password' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(userId, dto);
  }
}
