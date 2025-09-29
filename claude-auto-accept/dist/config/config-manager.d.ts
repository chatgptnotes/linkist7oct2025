import { AutoAcceptConfig } from '../types';
export declare class ConfigManager {
    private static instance;
    private config;
    private configPath;
    private constructor();
    static getInstance(): ConfigManager;
    private loadConfig;
    getConfig(): AutoAcceptConfig;
    updateConfig(updates: Partial<AutoAcceptConfig>): void;
    setEnabled(enabled: boolean): void;
    private saveConfig;
    private generateEnvContent;
    validateConfig(): {
        valid: boolean;
        errors: string[];
    };
    reset(): void;
}
//# sourceMappingURL=config-manager.d.ts.map