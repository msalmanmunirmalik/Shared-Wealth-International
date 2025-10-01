import { Router, Request, Response } from 'express';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import fs from 'fs';
import path from 'path';

const router: Router = Router();

// Temporary endpoint to fix unified_content table
router.post('/unified-content', async (req: Request, res: Response) => {
  try {
    console.log('🔧 Applying unified_content table fix...');
    
    // Read the SQL fix file
    const sqlFixPath = path.join(process.cwd(), 'fix-unified-content-table.sql');
    const sqlFix = fs.readFileSync(sqlFixPath, 'utf8');
    
    // Execute the SQL
    await DatabaseService.query(sqlFix);
    
    console.log('✅ Successfully applied unified_content table fix');
    
    // Verify the fix by checking if type column exists
    const result = await DatabaseService.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'unified_content' 
      AND column_name = 'type'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Verified: type column exists in unified_content table');
      res.json({
        success: true,
        message: 'Successfully applied unified_content table fix',
        verified: true
      });
    } else {
      console.log('❌ Error: type column still missing');
      res.status(500).json({
        success: false,
        message: 'Fix applied but type column still missing'
      });
    }
    
  } catch (error) {
    console.error('❌ Error applying unified_content fix:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply unified_content fix',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
