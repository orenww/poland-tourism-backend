import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ItemsService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const item = await this.prisma.item.create({
      data: createItemDto,
      include: {
        category: true,
        subItems: true,
      },
    });

    // Clear all items cache
    await this.cacheService.deletePattern('items:*');

    return item;
  }

  async findAll() {
    const cacheKey = 'items:all';

    // Try to get from cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      console.log('✅ Cache HIT: items:all');
      return cached;
    }

    console.log('❌ Cache MISS: items:all - fetching from DB');

    const items = await this.prisma.item.findMany({
      include: {
        category: true,
        subItems: true,
      },
    });

    // Save to cache for 1 hour (3600 seconds)
    await this.cacheService.set(cacheKey, items, 3600);

    return items;
  }

  async findOne(id: number) {
    const cacheKey = `items:${id}`;

    // Try to get from cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache HIT: items:${id}`);
      return cached;
    }

    console.log(`❌ Cache MISS: items:${id} - fetching from DB`);

    // If not in cache, get from database
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        subItems: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // Save to cache for 1 hour
    await this.cacheService.set(cacheKey, item, 3600);

    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.prisma.item.update({
      where: { id },
      data: updateItemDto,
      include: {
        category: true,
        subItems: true,
      },
    });

    // Clear all items cache
    await this.cacheService.deletePattern('items:*');

    return item;
  }

  async remove(id: number) {
    await this.prisma.item.delete({
      where: { id },
    });

    // Clear all items cache
    await this.cacheService.deletePattern('items:*');
  }
}
