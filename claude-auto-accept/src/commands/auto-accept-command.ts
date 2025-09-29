import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { AutoAcceptAgent } from '../agents/auto-accept-agent';
import { ConfigManager } from '../config/config-manager';
import { Logger } from '../utils/logger';
import { SlashCommandOptions } from '../types';

export class AutoAcceptCommand {
  private agent: AutoAcceptAgent;
  private configManager: ConfigManager;
  private logger: Logger;

  constructor() {
    this.agent = new AutoAcceptAgent();
    this.configManager = ConfigManager.getInstance();
    this.logger = Logger.getInstance();
  }

  public createCommand(): Command {
    const program = new Command();

    program
      .name('auto-accept')
      .description('Claude Code Auto-Accept System')
      .version('1.0.0');

    // Enable auto-accept
    program
      .command('on')
      .description('Enable auto-accept mode')
      .option('-f, --force', 'Force enable without confirmation')
      .action(async (options) => {
        await this.handleEnable(options.force);
      });

    // Disable auto-accept
    program
      .command('off')
      .description('Disable auto-accept mode')
      .action(async () => {
        await this.handleDisable();
      });

    // Show status
    program
      .command('status')
      .description('Show current auto-accept status')
      .action(async () => {
        await this.handleStatus();
      });

    // Configuration management
    program
      .command('config')
      .description('Manage configuration')
      .option('-s, --show', 'Show current configuration')
      .option('-e, --edit', 'Edit configuration interactively')
      .option('-r, --reset', 'Reset to default configuration')
      .action(async (options) => {
        await this.handleConfig(options);
      });

    // View logs
    program
      .command('logs')
      .description('View audit logs')
      .option('-n, --lines <number>', 'Number of log entries to show', '50')
      .option('-c, --clear', 'Clear audit logs')
      .action(async (options) => {
        await this.handleLogs(options);
      });

    // Test operation
    program
      .command('test')
      .description('Test if an operation would be auto-accepted')
      .argument('<operation>', 'Operation to test')
      .argument('<message>', 'Confirmation message to test')
      .action(async (operation, message) => {
        await this.handleTest(operation, message);
      });

    return program;
  }

  private async handleEnable(force: boolean = false): Promise<void> {
    try {
      if (!force) {
        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Enable auto-accept mode? This will automatically accept certain operations.',
            default: false
          }
        ]);

        if (!answers.confirm) {
          console.log(chalk.yellow('Auto-accept mode not enabled.'));
          return;
        }
      }

      this.agent.enableAutoAccept();
      const status = this.agent.getSessionStatus();
      
      console.log(chalk.green('✓ Auto-accept mode enabled'));
      console.log(chalk.blue(`Session ID: ${status.sessionId}`));
      console.log(chalk.blue(`Max accepts: ${status.remainingAccepts}`));
      console.log(chalk.blue(`Session timeout: ${Math.floor(status.timeRemaining / 60)} minutes`));
      
    } catch (error) {
      console.error(chalk.red('Failed to enable auto-accept:'), error);
      this.logger.error('Failed to enable auto-accept', error);
    }
  }

  private async handleDisable(): Promise<void> {
    try {
      this.agent.disableAutoAccept();
      console.log(chalk.green('✓ Auto-accept mode disabled'));
    } catch (error) {
      console.error(chalk.red('Failed to disable auto-accept:'), error);
      this.logger.error('Failed to disable auto-accept', error);
    }
  }

  private async handleStatus(): Promise<void> {
    try {
      const status = this.agent.getSessionStatus();
      const config = this.configManager.getConfig();

      console.log(chalk.bold('\n📊 Auto-Accept Status'));
      console.log(chalk.gray('─'.repeat(50)));
      
      console.log(`${chalk.bold('Mode:')} ${status.active ? chalk.green('ENABLED') : chalk.red('DISABLED')}`);
      console.log(`${chalk.bold('Session ID:')} ${status.sessionId}`);
      console.log(`${chalk.bold('Accepts used:')} ${status.acceptCount}/${config.maxAutoAccepts}`);
      console.log(`${chalk.bold('Time remaining:')} ${Math.floor(status.timeRemaining / 60)}m ${status.timeRemaining % 60}s`);
      
      console.log(`\n${chalk.bold('Configuration:')}`);
      console.log(`${chalk.bold('Allowed operations:')} ${config.allowedOperations.join(', ')}`);
      console.log(`${chalk.bold('Safety checks:')} ${config.safetyChecksEnabled ? chalk.green('ENABLED') : chalk.red('DISABLED')}`);
      console.log(`${chalk.bold('Hook mode:')} ${config.hookMode}`);
      
    } catch (error) {
      console.error(chalk.red('Failed to get status:'), error);
      this.logger.error('Failed to get status', error);
    }
  }

  private async handleConfig(options: any): Promise<void> {
    try {
      if (options.show) {
        await this.showConfig();
      } else if (options.edit) {
        await this.editConfig();
      } else if (options.reset) {
        await this.resetConfig();
      } else {
        console.log(chalk.yellow('Use --show, --edit, or --reset with the config command'));
      }
    } catch (error) {
      console.error(chalk.red('Configuration error:'), error);
      this.logger.error('Configuration error', error);
    }
  }

  private async showConfig(): Promise<void> {
    const config = this.configManager.getConfig();
    
    console.log(chalk.bold('\n⚙️  Configuration'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(JSON.stringify(config, null, 2));
  }

  private async editConfig(): Promise<void> {
    const config = this.configManager.getConfig();
    
    const answers = await inquirer.prompt([
      {
        type: 'number',
        name: 'sessionTimeout',
        message: 'Session timeout (minutes):',
        default: config.sessionTimeout,
        validate: (value) => value > 0 || 'Must be greater than 0'
      },
      {
        type: 'number',
        name: 'maxAutoAccepts',
        message: 'Maximum auto-accepts per session:',
        default: config.maxAutoAccepts,
        validate: (value) => value > 0 || 'Must be greater than 0'
      },
      {
        type: 'checkbox',
        name: 'allowedOperations',
        message: 'Allowed operation types:',
        choices: [
          { name: 'Git operations', value: 'git_operations', checked: config.allowedOperations.includes('git_operations') },
          { name: 'File operations', value: 'file_operations', checked: config.allowedOperations.includes('file_operations') },
          { name: 'Network operations', value: 'network_operations', checked: config.allowedOperations.includes('network_operations') },
          { name: 'All operations', value: 'all', checked: config.allowedOperations.includes('all') }
        ]
      },
      {
        type: 'confirm',
        name: 'safetyChecksEnabled',
        message: 'Enable safety checks:',
        default: config.safetyChecksEnabled
      }
    ]);

    this.configManager.updateConfig(answers);
    this.agent.updateConfig(answers);
    
    console.log(chalk.green('✓ Configuration updated'));
  }

  private async resetConfig(): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Reset configuration to defaults?',
        default: false
      }
    ]);

    if (answers.confirm) {
      this.configManager.reset();
      console.log(chalk.green('✓ Configuration reset to defaults'));
    }
  }

  private async handleLogs(options: any): Promise<void> {
    try {
      if (options.clear) {
        await this.clearLogs();
        return;
      }

      const limit = parseInt(options.lines) || 50;
      const logs = await this.logger.getAuditLogs(limit);
      
      if (logs.length === 0) {
        console.log(chalk.yellow('No audit logs found'));
        return;
      }

      console.log(chalk.bold(`\n📝 Audit Logs (last ${logs.length} entries)`));
      console.log(chalk.gray('─'.repeat(80)));
      
      logs.forEach(log => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        const decision = log.decision === 'accept' ? chalk.green('ACCEPT') : chalk.red('REJECT');
        const risk = this.formatRiskLevel(log.riskLevel);
        
        console.log(`${chalk.gray(timestamp)} ${decision} ${risk} ${chalk.cyan(log.operation)}`);
        console.log(`  ${chalk.gray('Message:')} ${log.message.substring(0, 60)}...`);
        console.log(`  ${chalk.gray('Reason:')} ${log.reason}`);
        console.log('');
      });
      
    } catch (error) {
      console.error(chalk.red('Failed to get logs:'), error);
      this.logger.error('Failed to get logs', error);
    }
  }

  private async clearLogs(): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Clear all audit logs?',
        default: false
      }
    ]);

    if (answers.confirm) {
      this.logger.clearAuditLogs();
      console.log(chalk.green('✓ Audit logs cleared'));
    }
  }

  private async handleTest(operation: string, message: string): Promise<void> {
    try {
      const result = await this.agent.testOperation(operation, message);
      
      console.log(chalk.bold('\n🧪 Test Result'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(`${chalk.bold('Operation:')} ${operation}`);
      console.log(`${chalk.bold('Message:')} ${message}`);
      console.log(`${chalk.bold('Would accept:')} ${result.wouldAccept ? chalk.green('YES') : chalk.red('NO')}`);
      console.log(`${chalk.bold('Risk level:')} ${this.formatRiskLevel(result.riskLevel)}`);
      console.log(`${chalk.bold('Reason:')} ${result.reason}`);
      
    } catch (error) {
      console.error(chalk.red('Test failed:'), error);
      this.logger.error('Test operation failed', error);
    }
  }

  private formatRiskLevel(level: 'low' | 'medium' | 'high'): string {
    switch (level) {
      case 'low': return chalk.green('LOW');
      case 'medium': return chalk.yellow('MEDIUM');
      case 'high': return chalk.red('HIGH');
      default: return chalk.gray('UNKNOWN');
    }
  }
}