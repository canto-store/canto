import { ForgotPasswordMail, Mail } from './mail.types'
import nodemailer from 'nodemailer'
import React from 'react'
import ForgotPasswordEmail from '../../../emails/ForgotPasswordEmail'
import { render } from '@react-email/render'
import ErrorNotificationEmail from '../../../emails/ErrorNotificationEmail'
import { ErrorContext } from '../../types/error.types'

export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  async sendForgotPasswordEmail(mail: ForgotPasswordMail): Promise<void> {
    try {
      const html = await render(
        React.createElement(ForgotPasswordEmail, {
          name: mail.name,
          resetLink: mail.resetLink,
        })
      )
      await this.sendMail({
        to: mail.to,
        subject: 'Canto — Password Reset',
        html,
      })
    } catch (err) {
      console.error('Failed to send forgot password email:', err)
    }
  }

  async sendErrorEmail(ctx: ErrorContext): Promise<void> {
    try {
      const html = await render(
        React.createElement(ErrorNotificationEmail, ctx)
      )
      if (process.env.ERROR_EMAIL_RECIPIENT) {
        await this.sendMail({
          to: process.env.ERROR_EMAIL_RECIPIENT,
          subject: 'Canto — Application Error Logged',
          html,
        })
      }
    } catch (err) {
      console.error('Failed to send error email:', err)
    }
  }

  async sendMail(mail: Mail): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
    })
  }
}
