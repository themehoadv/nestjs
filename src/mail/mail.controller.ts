import { Public } from '@/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail-test')
export class MailTestController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  @Public()
  async testEmail() {
    await this.mailService.sendEmailVerification(
      'hoadvfpoly@gmail.com',
      'test123',
    );
    return { message: 'Test email sent successfully' };
  }
}
