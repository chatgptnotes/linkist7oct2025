import { AutoAcceptConfig, ConfirmationRequest, ConfirmationResponse, AgentContext } from '../types';
export declare class AutoAcceptAgent {
    private config;
    private logger;
    private securityChecker;
    private session;
    constructor();
    private createSession;
    processConfirmationRequest(request: ConfirmationRequest): Promise<ConfirmationResponse>;
    private createResponse;
    private auditDecision;
    private isSessionExpired;
    private hasExceededLimits;
    getSessionStatus(): {
        active: boolean;
        acceptCount: number;
        remainingAccepts: number;
        timeRemaining: number;
        sessionId: string;
    };
    enableAutoAccept(): void;
    disableAutoAccept(): void;
    resetSession(): void;
    updateConfig(newConfig: Partial<AutoAcceptConfig>): void;
    getContext(): AgentContext;
    testOperation(operation: string, message: string): Promise<{
        wouldAccept: boolean;
        reason: string;
        riskLevel: 'low' | 'medium' | 'high';
    }>;
}
//# sourceMappingURL=auto-accept-agent.d.ts.map