import { ForgotPasswordMail } from './mail.types'
import nodemailer from 'nodemailer'
import React from 'react'
import ForgotPasswordEmail from '../../../emails/ForgotPasswordEmail'
import { render } from '@react-email/render'

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
    const html = await Promise.resolve(
      render(
        React.createElement(ForgotPasswordEmail, {
          name: mail.name,
          resetLink: mail.resetLink,
        })
      )
    )
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: mail.to,
      subject: mail.subject,
      html,
    })
  }
}
