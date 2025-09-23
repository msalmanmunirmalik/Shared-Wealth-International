#!/usr/bin/env ts-node

import { DatabaseService } from '../server/services/databaseService.js';
import MigrationRunner from '../server/migrations/migrationRunner.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  const command = process.argv[2];
  
  if (!command) {
    console.log(`
Usage: pnpm run migrations <command>

Commands:
  migrate     Run all pending migrations
  rollback    Rollback the last migration
  status      Show migration status
  reset       Reset all migrations (DEVELOPMENT ONLY)

Examples:
  pnpm run migrations migrate
  pnpm run migrations status
  pnpm run migrations rollback
  pnpm run migrations reset
`);
    process.exit(1);
  }

  const db = new DatabaseService();
  const migrationRunner = new MigrationRunner(db);

  try {
    await db.connect();

    switch (command) {
      case 'migrate':
        await migrationRunner.migrate();
        break;
        
      case 'rollback':
        await migrationRunner.rollback();
        break;
        
      case 'status':
        const status = await migrationRunner.getStatus();
        console.log('\n📊 Migration Status:');
        console.log('==================');
        
        if (status.executed.length > 0) {
          console.log('\n✅ Executed Migrations:');
          status.executed.forEach(migration => {
            const statusIcon = migration.success ? '✅' : '❌';
            const time = `${migration.execution_time_ms}ms`;
            console.log(`  ${statusIcon} ${migration.version} - ${migration.name} (${time})`);
            if (!migration.success && migration.error_message) {
              console.log(`     Error: ${migration.error_message}`);
            }
          });
        }
        
        if (status.pending.length > 0) {
          console.log('\n⏳ Pending Migrations:');
          status.pending.forEach(migration => {
            console.log(`  ⏳ ${migration.version} - ${migration.name}`);
          });
        } else if (status.executed.length > 0) {
          console.log('\n✅ No pending migrations');
        } else {
          console.log('\n📋 No migrations found');
        }
        break;
        
      case 'reset':
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ Migration reset is not allowed in production environment');
          process.exit(1);
        }
        await migrationRunner.reset();
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('Available commands: migrate, rollback, status, reset');
        process.exit(1);
    }

  } catch (error) {
    console.error('❌ Migration operation failed:', error);
    process.exit(1);
  } finally {
    await db.disconnect();
  }
}

main().catch(console.error);
