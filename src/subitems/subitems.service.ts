import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubItemDto } from './dto/create-subitem.dto';
import { UpdateSubItemDto } from './dto/update-subitem.dto';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class SubitemsService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async create(createSubitemDto: CreateSubItemDto) {
    const subItem = await this.prisma.subItem.create({
      data: createSubitemDto,
    });

    // Clear cache for parent item and all items
    await this.cacheService.deletePattern('items:*');

    return subItem;
  }

  findAll() {
    return this.prisma.subItem.findMany({
      include: {
        item: true,
      },
    });
  }

  findByItem(itemId: number) {
    return this.prisma.subItem.findMany({
      where: { itemId },
    });
  }

  findOne(id: number) {
    return this.prisma.subItem.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSubitemDto: UpdateSubItemDto) {
    const subItem = await this.prisma.subItem.update({
      where: { id },
      data: updateSubitemDto,
    });

    // Clear cache for parent item and all items
    await this.cacheService.deletePattern('items:*');

    return subItem;
  }

  async remove(id: number) {
    await this.prisma.subItem.delete({
      where: { id },
    });

    // Clear cache for parent item and all items
    await this.cacheService.deletePattern('items:*');
  }
}
