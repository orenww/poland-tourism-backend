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
import { ChainsService } from './chains.service';
import { CreateChainDto } from './dto/create-chain.dto';
import { UpdateChainDto } from './dto/update-chain.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chains')
export class ChainsController {
  constructor(private readonly chainsService: ChainsService) {}

  @Get()
  findAll() {
    return this.chainsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chainsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createChainDto: CreateChainDto) {
    return this.chainsService.create(createChainDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateChainDto: UpdateChainDto) {
    return this.chainsService.update(+id, updateChainDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.chainsService.remove(+id);
  }
}
