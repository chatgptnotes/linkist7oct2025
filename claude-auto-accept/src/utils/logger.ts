import winston from 'winston';
import * as path from 'path';
import * as fs from 'fs-extra';
import { AuditLogEntry } from '../types';

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;
  private auditLogger: winston.Logger;

  private constructor() {
    this.ensureLogDirectories();
    this.logger = this.createMainLogger();
    this.auditLogger = this.createAuditLogger();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private ensureLogDirectories(): void {
    const logsDir = path.join(process.cwd(), 'logs');
    fs.ensureDirSync(logsDir);
  }

  private createMainLogger(): winston.Logger {
    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return `${timestamp} ${level}: ${message} ${stack ? '\n' + stack : ''}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: path.join(process.cwd(), 'logs', 'auto-accept.log'),
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5
        })
      ]
    });
  }

  private createAuditLogger(): winston.Logger {
    return winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(process.cwd(), 'logs', 'auto-accept-audit.log'),
          maxsize: 50 * 1024 * 1024, // 50MB
          maxFiles: 10
        })
      ]
    });
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public error(message: string, error?: Error | any): void {
    this.logger.error(message, error);
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  public audit(entry: AuditLogEntry): void {
    this.auditLogger.info('audit', entry);
    this.info(`AUDIT: ${entry.operation} - ${entry.decision} - ${entry.reason}`);
  }

  public getAuditLogs(limit: number = 100): Promise<AuditLogEntry[]> {
    return new Promise((resolve, reject) => {
      const auditLogPath = path.join(process.cwd(), 'logs', 'auto-accept-audit.log');
      
      if (!fs.existsSync(auditLogPath)) {
        resolve([]);
        return;
      }

      try {
        const content = fs.readFileSync(auditLogPath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        const entries: AuditLogEntry[] = [];

        for (const line of lines.slice(-limit)) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message === 'audit') {
              entries.push(parsed.meta || parsed);
            }
          } catch (error) {
            // Skip invalid JSON lines
          }
        }

        resolve(entries.reverse()); // Most recent first
      } catch (error) {
        reject(error);
      }
    });
  }

  public clearAuditLogs(): void {
    const auditLogPath = path.join(process.cwd(), 'logs', 'auto-accept-audit.log');
    if (fs.existsSync(auditLogPath)) {
      fs.writeFileSync(auditLogPath, '');
      this.info('Audit logs cleared');
    }
  }
}