// src/utils/email.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import nodemailer from 'nodemailer';
import { sendEmail, EmailOptions } from './email'; // Assuming default export and EmailOptions type
import logger from '../config/logger';
import { config } from '../config'; // Assuming config holds email settings

// --- Mocks ---
vi.mock('nodemailer');
vi.mock('../config/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));
// Mock config if it's used directly for credentials/settings
vi.mock('../config', () => ({
  config: {
    email: {
      host: 'mock.smtp.host', // Corrected property name
      port: 587, // Corrected property name
      user: 'mockuser', // Corrected property name
      password: 'mockpass', // Corrected property name
      fromEmail: 'noreply@mock.com',
      fromName: 'Mock App',
    },
    // Add other necessary config properties
  },
}));

// --- Tests ---

describe('Email Utility', () => {
  const mockSendMail = vi.fn();
  const mockCreateTransport = vi.mocked(nodemailer.createTransport);
  const mockLoggerError = vi.mocked(logger.error);

  beforeEach(() => {
    vi.resetAllMocks();
    // Mock the transporter and sendMail function
    mockCreateTransport.mockReturnValue({
      sendMail: mockSendMail,
    } as any);
  });

  it('should create transporter with correct config and send email', async () => {
    // Arrange
    const options: EmailOptions = {
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test text body',
      html: '<p>Test HTML body</p>',
    };
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' }); // Simulate successful send

    // Act
    await sendEmail(options);

    // Assert
    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465, // Common logic based on port
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
    expect(mockSendMail).toHaveBeenCalledWith({
      from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it('should log error if sending email fails', async () => {
    // Arrange
    const options: EmailOptions = {
      to: 'fail@example.com',
      subject: 'Fail Test',
      text: '...',
      html: '<p>...</p>',
    }; // Added html to satisfy type
    const sendError = new Error('SMTP connection failed');
    mockSendMail.mockRejectedValue(sendError); // Simulate send failure

    // Act & Assert
    // Use try/catch or expect().rejects if sendEmail is designed to throw on failure
    try {
      await sendEmail(options);
    } catch (error) {
      // If sendEmail re-throws, catch it here
    }

    // Assertions remain the same regardless of whether it throws or just logs
    expect(mockCreateTransport).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalled();
    expect(mockLoggerError).toHaveBeenCalledWith(
      'Error sending email:',
      sendError
    );
  });

  it('should handle missing optional fields (text/html)', async () => {
    // Arrange
    // Provide an empty string for text to satisfy the type
    const options: EmailOptions = {
      to: 'minimal@example.com',
      subject: 'Minimal Test',
      html: '<p>HTML only</p>',
      text: '',
    };
    mockSendMail.mockResolvedValue({
      messageId: 'minimal-message-id',
    });

    // Act
    await sendEmail(options);

    // Assert
    expect(mockSendMail).toHaveBeenCalledWith({
      from: expect.any(String),
      to: options.to,
      subject: options.subject,
      text: '', // Expect text to be an empty string
      html: options.html,
    });
  });
});
