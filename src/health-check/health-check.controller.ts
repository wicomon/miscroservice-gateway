import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {

  @Get()
  healthCheck() {
    return 'Client Gateway is up and running!';
  }
}