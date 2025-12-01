import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubitemsService } from './subitems.service';
import { CreateSubItemDto } from './dto/create-subitem.dto';
import { UpdateSubItemDto } from './dto/update-subitem.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('subitems')
export class SubitemsController {
  constructor(private readonly subitemsService: SubitemsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSubitemDto: CreateSubItemDto) {
    return this.subitemsService.create(createSubitemDto);
  }

  @Get()
  findAll() {
    return this.subitemsService.findAll();
  }

  @Get('item/:itemId')
  findByItem(@Param('itemId') itemId: string) {
    return this.subitemsService.findByItem(+itemId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subitemsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubitemDto: UpdateSubItemDto) {
    return this.subitemsService.update(+id, updateSubitemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subitemsService.remove(+id);
  }
}
