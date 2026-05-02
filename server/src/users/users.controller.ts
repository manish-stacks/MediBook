// src/users/users.controller.ts
import { Controller, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me') @ApiOperation({ summary: 'Get my profile' })
  getProfile(@CurrentUser('id') userId: string) { return this.usersService.getProfile(userId); }

  @Put('me') @ApiOperation({ summary: 'Update my profile' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: any) { return this.usersService.updateProfile(userId, dto); }

  @Delete('me') @ApiOperation({ summary: 'Delete my account' })
  deleteAccount(@CurrentUser('id') userId: string) { return this.usersService.deleteAccount(userId); }

  @Get() @Roles(Role.SUPER_ADMIN) @ApiOperation({ summary: 'List all users (Admin)' })
  findAll(@Query() query: any) { return this.usersService.findAll(query); }

  @Put(':id/toggle-status') @Roles(Role.SUPER_ADMIN) @ApiOperation({ summary: 'Toggle user active status (Admin)' })
  toggleStatus(@Param('id') id: string) { return this.usersService.toggleStatus(id); }
}
