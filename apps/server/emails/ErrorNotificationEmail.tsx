import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Section,
} from '@react-email/components'
import { formatDate } from '../src/utils/helper'
import { ErrorContext } from '../src/types/error.types'

export default function ErrorNotificationEmail(ctx: ErrorContext) {
  return (
    <Html>
      <Head />
      <Preview>{`🚨 ${ctx.service} Error Alert`}</Preview>

      <Body style={{ backgroundColor: '#f5f5f5', padding: '30px' }}>
        <Container
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #eee',
            maxWidth: '680px',
          }}
        >
          <Heading style={{ fontSize: '22px', marginBottom: '20px' }}>
            🚨 Error Detected in {ctx.service}
          </Heading>

          {/* Summary Section */}
          <Section
            style={{
              marginBottom: '20px',
              padding: '15px',
              borderRadius: '8px',
              background: '#fafafa',
              border: '1px solid #e5e5e5',
            }}
          >
            <Text>
              <b>Environment:</b> {process.env.NODE_ENV ?? 'development'}
            </Text>
            <Text>
              <b>Timestamp:</b> {formatDate(ctx.timestamp)}
            </Text>
            <Text>
              <b>Request:</b> {ctx.method} {ctx.path}
            </Text>
            <Text>
              <b>User Name:</b> {ctx.userName ?? 'Unauthenticated'}
            </Text>
            <Text>
              <b>User ID:</b> {ctx.userId ?? 'Unauthenticated'}
            </Text>
          </Section>

          {/* Error Message */}
          <Section style={{ marginBottom: '20px' }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#d32f2f',
                fontSize: '16px',
                marginBottom: '8px',
              }}
            >
              Error Message:
            </Text>
            <pre
              style={{
                background: '#ffebee',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #ffcdd2',
                color: '#b71c1c',
                fontSize: '13px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {ctx.error.message}
            </pre>
          </Section>

          {/* Stack Trace */}
          <Section>
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: '8px',
                fontSize: '15px',
              }}
            >
              Stack Trace:
            </Text>
            <pre
              style={{
                background: '#f3f3f3',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                color: '#333',
              }}
            >
              {ctx.error.stack ?? 'No stack trace available'}
            </pre>
          </Section>

          <Text style={{ marginTop: '30px', fontSize: '12px', color: '#777' }}>
            This is an automated error alert — please investigate immediately.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
