import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChainDto } from './dto/create-chain.dto';
import { UpdateChainDto } from './dto/update-chain.dto';

@Injectable()
export class ChainsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.chain.findMany({
      include: {
        subItems: {
          select: {
            id: true,
            name: true,
            itemId: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.chain.findUnique({
      where: { id },
      include: {
        subItems: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                categoryId: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreateChainDto) {
    return this.prisma.chain.create({ data });
  }

  async update(id: number, data: UpdateChainDto) {
    return this.prisma.chain.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.chain.delete({
      where: { id },
    });
  }
}
