export declare class ConfirmationInterceptor {
    private agent;
    private logger;
    private isActive;
    constructor();
    activate(): void;
    deactivate(): void;
    private setupHooks;
    private cleanupHooks;
    private interceptStdin;
    private interceptConsoleInteractions;
    private isConfirmationRequest;
    private shouldIntercept;
    private handleConfirmationRequest;
    private requestManualInput;
    private extractOperation;
    simulateConfirmation(message: string, operation?: string): Promise<boolean>;
    getStatus(): {
        active: boolean;
        agentStatus: any;
    };
}
//# sourceMappingURL=confirmation-interceptor.d.ts.map