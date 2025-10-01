import { AuditLogEntry } from '../types';
export declare class Logger {
    private static instance;
    private logger;
    private auditLogger;
    private constructor();
    static getInstance(): Logger;
    private ensureLogDirectories;
    private createMainLogger;
    private createAuditLogger;
    info(message: string, meta?: any): void;
    error(message: string, error?: Error | any): void;
    warn(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    audit(entry: AuditLogEntry): void;
    getAuditLogs(limit?: number): Promise<AuditLogEntry[]>;
    clearAuditLogs(): void;
}
//# sourceMappingURL=logger.d.ts.map