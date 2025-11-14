export type Mail = {
  to: string
  subject: string
  html: string
}

export type ForgotPasswordMail = {
  to: string
  name: string
  resetLink: string
}
