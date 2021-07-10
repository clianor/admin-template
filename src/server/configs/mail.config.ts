import { MailModule } from '@server/modules/mail/mail.module';

export default MailModule.forRoot({
  domain: process.env.MAIL_DOMAIN,
  fromEmail: process.env.FROM_EMAIL,
  secure: JSON.parse(process.env.SMTP_SECURE),
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
});
