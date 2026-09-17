import { Controller, Post, Body } from '@nestjs/common';

import { EmergencySosService } from './emergency-sos.service';
import { CreateEmergencySosDto } from './dto/create-emergency-so.dto';

@Controller('emergency')
export class EmergencyController {

  constructor(
    private readonly emergencySosService: EmergencySosService,
  ) {}

  @Post('alert')
  createAlert(@Body() createEmergencySosDto: CreateEmergencySosDto) {
    return this.emergencySosService.create(createEmergencySosDto);
  }
}