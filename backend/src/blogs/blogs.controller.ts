// src/blogs/blogs.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Get() @Public() findAll(@Query() query: any) { return this.blogsService.findAll(query); }
  @Get(':slug') @Public() findOne(@Param('slug') slug: string) { return this.blogsService.findBySlug(slug); }
  @Post() @ApiBearerAuth() @Roles(Role.SUPER_ADMIN) create(@CurrentUser('id') userId: string, @Body() dto: any) { return this.blogsService.create(userId, dto); }
  @Put(':id') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN) update(@Param('id') id: string, @Body() dto: any) { return this.blogsService.update(id, dto); }
  @Delete(':id') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN) remove(@Param('id') id: string) { return this.blogsService.remove(id); }
  @Post('contact') @Public() contact(@Body() dto: any) { return this.blogsService.submitContact(dto); }
}
