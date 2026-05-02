// src/favorites/favorites.controller.ts
import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Favorites')
@Controller('favorites')
@ApiBearerAuth()
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post('toggle/:doctorId')
  @ApiOperation({ summary: 'Toggle favorite doctor' })
  toggle(@CurrentUser('id') userId: string, @Param('doctorId') doctorId: string) {
    return this.favoritesService.toggle(userId, doctorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get my favorite doctors' })
  getMyFavorites(@CurrentUser('id') userId: string) {
    return this.favoritesService.getMyFavorites(userId);
  }

  @Get('check/:doctorId')
  @ApiOperation({ summary: 'Check if doctor is favorited' })
  check(@CurrentUser('id') userId: string, @Param('doctorId') doctorId: string) {
    return this.favoritesService.checkFavorite(userId, doctorId);
  }
}
