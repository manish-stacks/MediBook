"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlogsService = class BlogsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query = {}) {
        const { page = 1, limit = 9, tag } = query;
        const where = { isPublished: true };
        if (tag)
            where.tags = { string_contains: tag };
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
    async findBySlug(slug) {
        const post = await this.prisma.blogPost.findUnique({
            where: { slug },
            include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
        });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        return { message: 'Blog post fetched', data: post };
    }
    async create(userId, dto) {
        const slug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
        const post = await this.prisma.blogPost.create({
            data: { ...dto, slug, authorId: userId, tags: dto.tags ? JSON.stringify(dto.tags) : undefined },
        });
        return { message: 'Blog post created', data: post };
    }
    async update(id, dto) {
        const post = await this.prisma.blogPost.update({
            where: { id },
            data: { ...dto, tags: dto.tags ? JSON.stringify(dto.tags) : undefined, publishedAt: dto.isPublished ? new Date() : null },
        });
        return { message: 'Blog post updated', data: post };
    }
    async remove(id) {
        await this.prisma.blogPost.delete({ where: { id } });
        return { message: 'Blog post deleted' };
    }
    async submitContact(dto) {
        const contact = await this.prisma.contactForm.create({ data: dto });
        return { message: 'Message sent successfully', data: contact };
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogsService);
//# sourceMappingURL=blogs.service.js.map