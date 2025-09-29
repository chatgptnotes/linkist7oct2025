import { AutoAcceptConfig, ConfirmationRequest, SecurityCheck } from '../types';
export declare class SecurityChecker {
    private config;
    private logger;
    private securityChecks;
    constructor(config: AutoAcceptConfig);
    private initializeSecurityChecks;
    assessRisk(request: ConfirmationRequest): {
        decision: 'allow' | 'deny' | 'ask';
        riskLevel: 'low' | 'medium' | 'high';
        reason: string;
        matchedCheck?: SecurityCheck;
    };
    private isOperationAllowed;
    updateConfig(newConfig: AutoAcceptConfig): void;
    validatePattern(pattern: string): {
        valid: boolean;
        error?: string;
    };
    testPattern(pattern: string, testString: string): boolean;
}
//# sourceMappingURL=security-checker.d.ts.map