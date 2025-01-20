import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/users/events/user-created.event';
import { WelcomeEmailContext } from 'src/interfaces/types';
import { ENV } from 'src/constants';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
      },
      // logger: true, // Enable logging
      // debug: true, // Enable debugging
    });
  }

  private compileTemplate<T>(templateName: string, context: T): string {
    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const templateSource = fs.readFileSync(filePath, 'utf8');
    const template = hbs.compile(templateSource);
    return template(context);
  }

  async sendEmail<T extends Record<string, unknown>>(
    to: string,
    subject: string,
    templateName: string,
    context: T
  ): Promise<void> {
    if (!to || typeof to !== 'string' || to.trim() === '') {
      throw new Error('Recipient email is invalid');
    }

    const html = this.compileTemplate(templateName, context);
    const mailOptions: nodemailer.SendMailOptions = {
      from: ENV.EMAIL_FROM,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  @OnEvent('user.created')
  async handleUserCreatedEvent(user: UserCreatedEvent): Promise<void> {
    console.log('Received user data:', user); // This is the payload
    await this.sendEmail<WelcomeEmailContext>(
      user.email,
      'Welcome to Micromart',
      'welcome',
      { name: user.name, dashboardLink: 'https://geosmart-app.netlify.app/' }
    ); // Access the payload here

    console.log('Email sent successfully');
  }
}
