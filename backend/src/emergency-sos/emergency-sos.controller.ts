import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EmergencySosService } from './emergency-sos.service';
import { CreateEmergencySosDto } from './dto/create-emergency-so.dto';

@Controller('sos-alerts')
export class EmergencySosController {
  constructor(
    private readonly emergencySosService: EmergencySosService,
  ) {}

  @Post()
  create(@Body() createEmergencySosDto: CreateEmergencySosDto) {
    return this.emergencySosService.create(createEmergencySosDto);
  }

  @Get()
  findAll() {
    return this.emergencySosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emergencySosService.findOne(id);
  }

  @Post('alert')
createAlert(@Body() createEmergencySosDto: CreateEmergencySosDto) {
  return this.emergencySosService.create(createEmergencySosDto);
}
}