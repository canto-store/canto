import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Img,
  Section,
} from '@react-email/components'
import * as React from 'react'

export interface ForgotPasswordEmailProps {
  name: string
  resetLink: string
}

const ForgotPasswordEmail: React.FC<ForgotPasswordEmailProps> = ({
  name,
  resetLink,
}) => (
  <Html>
    <Head />
    <Preview>Reset your Canto password</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Logo */}
        <Section
          style={{
            justifyContent: 'center',
            marginBottom: '30px',
            display: 'flex',
          }}
        >
          <Img
            src="https://canto-storage.fra1.cdn.digitaloceanspaces.com/logo-yellow-burgandy.png"
            alt="Canto Logo"
            width="150"
            height="auto"
          />
        </Section>

        {/* Header */}
        <Heading style={h1}>Reset Your Password</Heading>

        {/* Message */}
        <Text style={text}>
          Hi {name || 'there'},<br />
          We received a request to reset your Canto password.
        </Text>
        <Text style={text}>
          Click the button below to set a new password. This link will expire in
          1 hour.
        </Text>

        {/* Button */}
        <Section style={{ textAlign: 'center' }}>
          <Button style={button} href={resetLink}>
            Reset Password
          </Button>
        </Section>

        {/* Footer Note */}
        <Text style={textSmall}>
          If you didn’t request this, you can safely ignore this email.
        </Text>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Canto. All rights reserved.
          </Text>
          <Text style={footerLink}>
            <a
              href="https://canto-store.com"
              style={{ color: '#94a3b8', textDecoration: 'none' }}
            >
              Visit Canto
            </a>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#f9fafb',
  fontFamily: 'Inter, Arial, sans-serif',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '40px 32px',
  margin: '0 auto',
  maxWidth: '600px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}

const h1 = {
  fontSize: '24px',
  fontWeight: '700',
  marginBottom: '20px',
  textAlign: 'center' as const,
}

const text = {
  fontSize: '15px',
  lineHeight: '1.6',
  marginBottom: '16px',
}

const textSmall = {
  color: '#94a3b8',
  fontSize: '13px',
  marginTop: '24px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#001835',
  color: '#ffffff',
  textDecoration: 'none',
  padding: '12px',
  borderRadius: '8px',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  marginTop: '20px',
}

const footer = {
  borderTop: '1px solid #f1f5f9',
  marginTop: '40px',
  paddingTop: '20px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '13px',
  color: '#94a3b8',
  marginBottom: '4px',
}

const footerLink = {
  fontSize: '13px',
  color: '#94a3b8',
}

export default ForgotPasswordEmail
