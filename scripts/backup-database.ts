#!/usr/bin/env ts-node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const execAsync = promisify(exec);
dotenv.config();

interface BackupConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  backupDir: string;
  retentionDays: number;
}

export class DatabaseBackup {
  private config: BackupConfig;

  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'wealth_pioneers',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      backupDir: process.env.BACKUP_DIR || './backups',
      retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30')
    };
  }

  /**
   * Create a timestamped backup filename
   */
  private getBackupFilename(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${this.config.database}_backup_${timestamp}.sql`;
  }

  /**
   * Ensure backup directory exists
   */
  private async ensureBackupDir(): Promise<void> {
    if (!fs.existsSync(this.config.backupDir)) {
      fs.mkdirSync(this.config.backupDir, { recursive: true });
      console.log(`✅ Created backup directory: ${this.config.backupDir}`);
    }
  }

  /**
   * Create a full database backup
   */
  async createBackup(): Promise<string> {
    try {
      await this.ensureBackupDir();
      
      const filename = this.getBackupFilename();
      const filepath = path.join(this.config.backupDir, filename);
      
      console.log(`🔄 Creating database backup: ${filename}`);
      
      // Set PGPASSWORD environment variable for pg_dump
      const env = {
        ...process.env,
        PGPASSWORD: this.config.password
      };
      
      // Build pg_dump command
      const command = [
        'pg_dump',
        `--host=${this.config.host}`,
        `--port=${this.config.port}`,
        `--username=${this.config.username}`,
        '--verbose',
        '--clean',
        '--no-owner',
        '--no-privileges',
        '--format=plain',
        `--file=${filepath}`,
        this.config.database
      ].join(' ');
      
      const { stdout, stderr } = await execAsync(command, { env });
      
      if (stderr && !stderr.includes('pg_dump: warning')) {
        console.warn('⚠️ Backup warnings:', stderr);
      }
      
      // Verify backup file was created
      if (!fs.existsSync(filepath)) {
        throw new Error('Backup file was not created');
      }
      
      const stats = fs.statSync(filepath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`✅ Backup created successfully: ${filename} (${sizeInMB} MB)`);
      
      return filepath;
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw error;
    }
  }

  /**
   * Restore database from backup
   */
  async restoreBackup(backupFile: string): Promise<void> {
    try {
      if (!fs.existsSync(backupFile)) {
        throw new Error(`Backup file not found: ${backupFile}`);
      }
      
      console.log(`🔄 Restoring database from: ${backupFile}`);
      
      // Set PGPASSWORD environment variable for psql
      const env = {
        ...process.env,
        PGPASSWORD: this.config.password
      };
      
      // Build psql command
      const command = [
        'psql',
        `--host=${this.config.host}`,
        `--port=${this.config.port}`,
        `--username=${this.config.username}`,
        '--verbose',
        `--file=${backupFile}`,
        this.config.database
      ].join(' ');
      
      const { stdout, stderr } = await execAsync(command, { env });
      
      if (stderr && !stderr.includes('psql: warning')) {
        console.warn('⚠️ Restore warnings:', stderr);
      }
      
      console.log('✅ Database restored successfully');
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw error;
    }
  }

  /**
   * List available backups
   */
  async listBackups(): Promise<Array<{
    filename: string;
    filepath: string;
    size: number;
    created: Date;
  }>> {
    try {
      await this.ensureBackupDir();
      
      const files = fs.readdirSync(this.config.backupDir)
        .filter(file => file.endsWith('.sql') && file.includes('_backup_'))
        .map(filename => {
          const filepath = path.join(this.config.backupDir, filename);
          const stats = fs.statSync(filepath);
          
          return {
            filename,
            filepath,
            size: stats.size,
            created: stats.birthtime
          };
        })
        .sort((a, b) => b.created.getTime() - a.created.getTime());
      
      return files;
    } catch (error) {
      console.error('❌ Failed to list backups:', error);
      throw error;
    }
  }

  /**
   * Clean up old backups based on retention policy
   */
  async cleanupOldBackups(): Promise<number> {
    try {
      const backups = await this.listBackups();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
      
      const oldBackups = backups.filter(backup => backup.created < cutoffDate);
      
      if (oldBackups.length === 0) {
        console.log('✅ No old backups to clean up');
        return 0;
      }
      
      console.log(`🗑️ Cleaning up ${oldBackups.length} old backup(s)...`);
      
      let cleanedCount = 0;
      for (const backup of oldBackups) {
        try {
          fs.unlinkSync(backup.filepath);
          console.log(`🗑️ Deleted old backup: ${backup.filename}`);
          cleanedCount++;
        } catch (error) {
          console.error(`❌ Failed to delete backup ${backup.filename}:`, error);
        }
      }
      
      console.log(`✅ Cleaned up ${cleanedCount} old backup(s)`);
      return cleanedCount;
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Schedule automatic backups
   */
  async scheduleBackup(): Promise<void> {
    try {
      console.log('🔄 Creating scheduled backup...');
      
      // Create backup
      const backupFile = await this.createBackup();
      
      // Clean up old backups
      await this.cleanupOldBackups();
      
      // Log backup completion
      const timestamp = new Date().toISOString();
      console.log(`✅ Scheduled backup completed at ${timestamp}`);
      
    } catch (error) {
      console.error('❌ Scheduled backup failed:', error);
      throw error;
    }
  }

  /**
   * Verify backup integrity
   */
  async verifyBackup(backupFile: string): Promise<boolean> {
    try {
      if (!fs.existsSync(backupFile)) {
        return false;
      }
      
      // Check if file contains expected PostgreSQL dump headers
      const content = fs.readFileSync(backupFile, 'utf8');
      const hasHeader = content.includes('-- PostgreSQL database dump') || 
                       content.includes('-- Dumped from database version');
      
      if (!hasHeader) {
        console.warn('⚠️ Backup file may be corrupted - missing PostgreSQL dump headers');
        return false;
      }
      
      // Check file size (should not be empty)
      const stats = fs.statSync(backupFile);
      if (stats.size < 1000) { // Less than 1KB is suspicious
        console.warn('⚠️ Backup file is unusually small');
        return false;
      }
      
      console.log('✅ Backup file integrity verified');
      return true;
    } catch (error) {
      console.error('❌ Backup verification failed:', error);
      return false;
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const backup = new DatabaseBackup();
  
  if (!command) {
    console.log(`
Usage: pnpm run backup <command> [options]

Commands:
  create                    Create a new database backup
  restore <backup-file>     Restore database from backup file
  list                      List available backups
  cleanup                   Clean up old backups
  schedule                  Create scheduled backup (with cleanup)
  verify <backup-file>      Verify backup file integrity

Examples:
  pnpm run backup create
  pnpm run backup restore ./backups/wealth_pioneers_backup_2024-01-15.sql
  pnpm run backup list
  pnpm run backup cleanup
  pnpm run backup schedule
  pnpm run backup verify ./backups/wealth_pioneers_backup_2024-01-15.sql
`);
    process.exit(1);
  }
  
  try {
    switch (command) {
      case 'create':
        await backup.createBackup();
        break;
        
      case 'restore':
        const restoreFile = process.argv[3];
        if (!restoreFile) {
          console.error('❌ Please provide backup file path');
          process.exit(1);
        }
        await backup.restoreBackup(restoreFile);
        break;
        
      case 'list':
        const backups = await backup.listBackups();
        console.log('\n📋 Available Backups:');
        console.log('====================');
        
        if (backups.length === 0) {
          console.log('No backups found');
        } else {
          backups.forEach(backup => {
            const sizeInMB = (backup.size / (1024 * 1024)).toFixed(2);
            const created = backup.created.toISOString().split('T')[0];
            console.log(`📁 ${backup.filename} (${sizeInMB} MB) - ${created}`);
          });
        }
        break;
        
      case 'cleanup':
        await backup.cleanupOldBackups();
        break;
        
      case 'schedule':
        await backup.scheduleBackup();
        break;
        
      case 'verify':
        const verifyFile = process.argv[3];
        if (!verifyFile) {
          console.error('❌ Please provide backup file path');
          process.exit(1);
        }
        const isValid = await backup.verifyBackup(verifyFile);
        process.exit(isValid ? 0 : 1);
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Operation failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default DatabaseBackup;
