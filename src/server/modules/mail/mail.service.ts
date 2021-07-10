import { Inject, Injectable } from '@nestjs/common';
import { MAIL_CONFIG_OPTIONS } from '@server/modules/common/common.constants';
import { MailModuleOptions } from '@server/modules/mail/mail.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail({ to, subject, htmlContent }): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport({
        secure: this.options.secure, // true for 465, false for other ports
        host: this.options.host,
        port: this.options.port,
        auth: {
          user: this.options.user,
          pass: this.options.password,
        },
      });

      await transporter.sendMail({
        from: `"${this.options.fromEmail}" <${this.options.fromEmail}@${this.options.domain}>`,
        subject: subject,
        to: to,
        html: htmlContent,
      });
      return true;
    } catch {
      return false;
    }
  }
}
