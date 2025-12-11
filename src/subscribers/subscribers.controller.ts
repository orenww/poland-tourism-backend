import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  // POST /subscribers/subscribe
  @Post('subscribe')
  subscribe(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @Req() request: Request,
  ) {
    const forwardedIps = request.headers['x-forwarded-for'];
    const ipAddress = Array.isArray(forwardedIps)
      ? forwardedIps[0]
      : forwardedIps || (request as any).socket?.remoteAddress || 'unknown';

    return this.subscribersService.subscribe(createSubscriberDto, ipAddress);
  }

  // GET /subscribers/verify/:token
  @Get('verify/:token')
  verifyEmail(@Param('token') token: string) {
    return this.subscribersService.verifyEmail(token);
  }

  // POST /subscribers/unsubscribe
  @Post('unsubscribe')
  unsubscribe(@Body('email') email: string) {
    return this.subscribersService.unsubscribe(email);
  }

  // GET /subscribers
  @Get()
  findAll() {
    return this.subscribersService.findAll();
  }

  // GET /subscribers/verified
  @Get('verified')
  getVerifiedSubscribers() {
    return this.subscribersService.getVerifiedSubscribers();
  }
}
