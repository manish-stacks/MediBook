// src/blogs/blogs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any = {}) {
    const { page = 1, limit = 9, tag } = query;
    const where: any = { isPublished: true };
    if (tag) where.tags = { string_contains: tag };
    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.blogPost.count({ where }),
    ]);
    return { message: 'Blog posts fetched', data: { posts, total, page: Number(page), limit: Number(limit) } };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return { message: 'Blog post fetched', data: post };
  }

  async create(userId: string, dto: any) {
    const slug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const post = await this.prisma.blogPost.create({
      data: { ...dto, slug, authorId: userId, tags: dto.tags ? JSON.stringify(dto.tags) : undefined },
    });
    return { message: 'Blog post created', data: post };
  }

  async update(id: string, dto: any) {
    const post = await this.prisma.blogPost.update({
      where: { id },
      data: { ...dto, tags: dto.tags ? JSON.stringify(dto.tags) : undefined, publishedAt: dto.isPublished ? new Date() : null },
    });
    return { message: 'Blog post updated', data: post };
  }

  async remove(id: string) {
    await this.prisma.blogPost.delete({ where: { id } });
    return { message: 'Blog post deleted' };
  }

  async submitContact(dto: any) {
    const contact = await this.prisma.contactForm.create({ data: dto });
    return { message: 'Message sent successfully', data: contact };
  }
}
