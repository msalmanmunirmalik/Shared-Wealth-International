import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router: express.Router = express.Router();

/**
 * @swagger
 * /api/setup/database:
 *   post:
 *     summary: Initialize database schema
 *     description: Sets up the database schema and sample data
 *     tags: [Setup]
 *     responses:
 *       200:
 *         description: Database setup completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 tables:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Database setup failed
 */
router.post('/database', async (req, res) => {
  try {
    console.log('🏗️  Starting database setup...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../../scripts/schema.sql');
    console.log('📖 Reading schema file:', schemaPath);
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Schema file loaded successfully');

    // Execute schema in chunks to avoid issues
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`🔧 Executing ${statements.length} SQL statements...`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await DatabaseService.query(statement);
          console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
        } catch (error) {
          console.log(`⚠️  Statement failed (may already exist): ${statement.substring(0, 50)}...`);
          console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    const tablesResult = await DatabaseService.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('📋 Created tables:', tables);

    console.log('🎉 Database setup completed successfully!');
    
    res.json({
      success: true,
      message: 'Database setup completed successfully',
      tables: tables
    });
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database setup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/setup/status:
 *   get:
 *     summary: Check database setup status
 *     description: Checks if the database schema is properly set up
 *     tags: [Setup]
 *     responses:
 *       200:
 *         description: Database status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSetup:
 *                   type: boolean
 *                 tables:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Error checking database status
 */
router.get('/status', async (req, res) => {
  try {
    // Check if users table exists
    const result = await DatabaseService.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = result.rows.map(row => row.table_name);
    const isSetup = tables.includes('users');
    
    res.json({
      isSetup,
      tables,
      message: isSetup ? 'Database is properly set up' : 'Database needs setup'
    });
    
  } catch (error) {
    console.error('❌ Error checking database status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking database status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
