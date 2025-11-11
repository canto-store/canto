export type Mail = {
  to: string
  subject: string
  body: string
}

export type ForgotPasswordMail = Omit<Mail, 'body'> & {
  name: string
  resetLink: string
}
