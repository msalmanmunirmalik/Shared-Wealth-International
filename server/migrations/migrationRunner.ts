import { DatabaseService } from '../services/databaseService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Migration {
  version: string;
  name: string;
  up: (db: DatabaseService) => Promise<void>;
  down: (db: DatabaseService) => Promise<void>;
}

export class MigrationRunner {
  private db: DatabaseService;
  private migrationsPath: string;

  constructor(db: DatabaseService, migrationsPath: string = path.join(__dirname, 'files')) {
    this.db = db;
    this.migrationsPath = migrationsPath;
  }

  /**
   * Initialize the migrations table
   */
  async initialize(): Promise<void> {
    try {
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          version VARCHAR(50) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          execution_time_ms INTEGER,
          success BOOLEAN DEFAULT true,
          error_message TEXT
        )
      `);
      console.log('✅ Migrations table initialized');
    } catch (error) {
      console.error('❌ Failed to initialize migrations table:', error);
      throw error;
    }
  }

  /**
   * Get all executed migrations
   */
  async getExecutedMigrations(): Promise<string[]> {
    try {
      const result = await this.db.query(
        'SELECT version FROM migrations WHERE success = true ORDER BY version'
      );
      return result.rows.map(row => row.version);
    } catch (error) {
      console.error('❌ Failed to get executed migrations:', error);
      throw error;
    }
  }

  /**
   * Load migration files
   */
  async loadMigrations(): Promise<Migration[]> {
    try {
      const files = fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.ts'))
        .sort();

      const migrations: Migration[] = [];

      for (const file of files) {
        const filePath = path.join(this.migrationsPath, file);
        const migration = await import(filePath);
        
        if (migration.default && typeof migration.default === 'object') {
          const migrationObj = migration.default as Migration;
          
          // Validate migration structure
          if (!migrationObj.version || !migrationObj.name || !migrationObj.up || !migrationObj.down) {
            throw new Error(`Invalid migration structure in ${file}`);
          }
          
          migrations.push(migrationObj);
        }
      }

      return migrations;
    } catch (error) {
      console.error('❌ Failed to load migrations:', error);
      throw error;
    }
  }

  /**
   * Run all pending migrations
   */
  async migrate(): Promise<void> {
    console.log('🔄 Starting database migrations...');
    
    try {
      await this.initialize();
      
      const executedMigrations = await this.getExecutedMigrations();
      const availableMigrations = await this.loadMigrations();
      
      const pendingMigrations = availableMigrations.filter(
        migration => !executedMigrations.includes(migration.version)
      );

      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations');
        return;
      }

      console.log(`📋 Found ${pendingMigrations.length} pending migrations`);

      for (const migration of pendingMigrations) {
        await this.runMigration(migration);
      }

      console.log('✅ All migrations completed successfully');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Run a single migration
   */
  async runMigration(migration: Migration): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log(`🔄 Running migration: ${migration.version} - ${migration.name}`);
      
      // Start transaction
      await this.db.query('BEGIN');
      
      // Run migration
      await migration.up(this.db);
      
      // Record migration
      const executionTime = Date.now() - startTime;
      await this.db.query(
        'INSERT INTO migrations (version, name, execution_time_ms, success) VALUES ($1, $2, $3, $4)',
        [migration.version, migration.name, executionTime, true]
      );
      
      // Commit transaction
      await this.db.query('COMMIT');
      
      console.log(`✅ Migration ${migration.version} completed in ${executionTime}ms`);
    } catch (error) {
      // Rollback transaction
      await this.db.query('ROLLBACK');
      
      const executionTime = Date.now() - startTime;
      
      // Record failed migration
      try {
        await this.db.query(
          'INSERT INTO migrations (version, name, execution_time_ms, success, error_message) VALUES ($1, $2, $3, $4, $5)',
          [migration.version, migration.name, executionTime, false, error instanceof Error ? error.message : String(error)]
        );
      } catch (recordError) {
        console.error('❌ Failed to record migration failure:', recordError);
      }
      
      console.error(`❌ Migration ${migration.version} failed:`, error);
      throw error;
    }
  }

  /**
   * Rollback the last migration
   */
  async rollback(): Promise<void> {
    console.log('🔄 Rolling back last migration...');
    
    try {
      await this.initialize();
      
      const lastMigration = await this.db.query(
        'SELECT version, name FROM migrations WHERE success = true ORDER BY version DESC LIMIT 1'
      );
      
      if (lastMigration.rows.length === 0) {
        console.log('✅ No migrations to rollback');
        return;
      }
      
      const migration = lastMigration.rows[0];
      const availableMigrations = await this.loadMigrations();
      const migrationToRollback = availableMigrations.find(m => m.version === migration.version);
      
      if (!migrationToRollback) {
        throw new Error(`Migration ${migration.version} not found in available migrations`);
      }
      
      const startTime = Date.now();
      
      try {
        console.log(`🔄 Rolling back migration: ${migration.version} - ${migration.name}`);
        
        // Start transaction
        await this.db.query('BEGIN');
        
        // Run rollback
        await migrationToRollback.down(this.db);
        
        // Remove migration record
        await this.db.query('DELETE FROM migrations WHERE version = $1', [migration.version]);
        
        // Commit transaction
        await this.db.query('COMMIT');
        
        const executionTime = Date.now() - startTime;
        console.log(`✅ Migration ${migration.version} rolled back in ${executionTime}ms`);
      } catch (error) {
        // Rollback transaction
        await this.db.query('ROLLBACK');
        
        console.error(`❌ Rollback of migration ${migration.version} failed:`, error);
        throw error;
      }
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }

  /**
   * Get migration status
   */
  async getStatus(): Promise<{
    executed: Array<{
      version: string;
      name: string;
      executed_at: Date;
      execution_time_ms: number;
      success: boolean;
      error_message?: string;
    }>;
    pending: Array<{
      version: string;
      name: string;
    }>;
  }> {
    try {
      await this.initialize();
      
      const executedMigrations = await this.db.query(
        'SELECT version, name, executed_at, execution_time_ms, success, error_message FROM migrations ORDER BY version'
      );
      
      const availableMigrations = await this.loadMigrations();
      const executedVersions = executedMigrations.rows.map(row => row.version);
      
      const pendingMigrations = availableMigrations
        .filter(migration => !executedVersions.includes(migration.version))
        .map(migration => ({
          version: migration.version,
          name: migration.name
        }));
      
      return {
        executed: executedMigrations.rows,
        pending: pendingMigrations
      };
    } catch (error) {
      console.error('❌ Failed to get migration status:', error);
      throw error;
    }
  }

  /**
   * Reset all migrations (DANGEROUS - for development only)
   */
  async reset(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Migration reset is not allowed in production environment');
    }
    
    console.log('⚠️ Resetting all migrations (DEVELOPMENT ONLY)...');
    
    try {
      await this.initialize();
      
      const availableMigrations = await this.loadMigrations();
      const executedMigrations = await this.getExecutedMigrations();
      
      // Rollback migrations in reverse order
      for (let i = executedMigrations.length - 1; i >= 0; i--) {
        const version = executedMigrations[i];
        const migration = availableMigrations.find(m => m.version === version);
        
        if (migration) {
          const startTime = Date.now();
          
          try {
            console.log(`🔄 Rolling back migration: ${migration.version} - ${migration.name}`);
            
            await this.db.query('BEGIN');
            await migration.down(this.db);
            await this.db.query('DELETE FROM migrations WHERE version = $1', [version]);
            await this.db.query('COMMIT');
            
            const executionTime = Date.now() - startTime;
            console.log(`✅ Migration ${migration.version} rolled back in ${executionTime}ms`);
          } catch (error) {
            await this.db.query('ROLLBACK');
            console.error(`❌ Failed to rollback migration ${migration.version}:`, error);
            throw error;
          }
        }
      }
      
      console.log('✅ All migrations reset successfully');
    } catch (error) {
      console.error('❌ Migration reset failed:', error);
      throw error;
    }
  }
}

export default MigrationRunner;
