import { DynamicModule, Global, Module } from '@nestjs/common';
import { MAIL_CONFIG_OPTIONS } from '@server/modules/common/common.constants';
import { MailModuleOptions } from '@server/modules/mail/mail.interface';
import { MailService } from '@server/modules/mail/mail.service';

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: MAIL_CONFIG_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
