import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
router.post('/database', async (req, res) => {
    try {
        console.log('🏗️  Starting database setup...');
        const schemaPath = path.join(__dirname, '../../scripts/schema.sql');
        console.log('📖 Reading schema file:', schemaPath);
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found: ${schemaPath}`);
        }
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        console.log('📄 Schema file loaded successfully');
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
                }
                catch (error) {
                    console.log(`⚠️  Statement failed (may already exist): ${statement.substring(0, 50)}...`);
                    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        }
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
    }
    catch (error) {
        console.error('❌ Database setup failed:', error);
        res.status(500).json({
            success: false,
            message: 'Database setup failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/status', async (req, res) => {
    try {
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
    }
    catch (error) {
        console.error('❌ Error checking database status:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking database status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/populate', async (req, res) => {
    try {
        console.log('📊 Populating database with companies...');
        const existingCheck = await DatabaseService.query('SELECT COUNT(*) as count FROM companies WHERE 1=1');
        const existing = parseInt(existingCheck.rows[0]?.count || 0);
        if (existing >= 28) {
            return res.json({
                success: true,
                message: `Database already has ${existing} companies`,
                data: { totalCompanies: existing, inserted: 0 }
            });
        }
        const companies = [
            { name: 'Ktalise', industry: 'Social Enterprise', location: 'Portugal', website: 'https://ktalise.com' },
            { name: 'Beplay', industry: 'Social Enterprise', location: 'Brazil', website: 'https://beplay.com' },
            { name: 'Carsis Consulting', industry: 'Social Enterprise', location: 'UK', website: 'https://carsisconsulting.com' },
            { name: 'Consortio', industry: 'Social Enterprise', location: 'Ireland', website: 'https://consortio.com' },
            { name: 'Eternal Flame', industry: 'Social Enterprise', location: 'Lesotho', website: 'https://eternalflame.com' },
            { name: 'Eupolisgrupa', industry: 'Social Enterprise', location: 'Croatia', website: 'https://eupolisgrupa.com' },
            { name: 'Fairbnb', industry: 'Social Enterprise', location: 'Italy', website: 'https://fairbnb.com' },
            { name: 'Givey Ktd', industry: 'Social Enterprise', location: 'Cameroon', website: 'https://giveyktd.com' },
            { name: 'Kula Eco Pads', industry: 'Social Enterprise', location: 'Indonesia', website: 'https://kulaecopads.com' },
            { name: 'LocoSoco PLC', industry: 'Social Enterprise', location: 'UK', website: 'https://locosocoplc.com' },
            { name: 'Media Cultured', industry: 'Social Enterprise', location: 'UK', website: 'https://mediacultured.com' },
            { name: 'NCDF', industry: 'Social Enterprise', location: 'Nigeria', website: 'https://ncdf.com' },
            { name: 'PadCare', industry: 'Social Enterprise', location: 'India', website: 'https://padcare.com' },
            { name: 'Pathways Points', industry: 'Social Enterprise', location: 'UK', website: 'https://pathwayspoints.com' },
            { name: 'Purview Ltd', industry: 'Social Enterprise', location: 'UK', website: 'https://purviewltd.com' },
            { name: 'Research Automators', industry: 'Social Enterprise', location: 'Sweden', website: 'https://researchautomators.com' },
            { name: 'SE Ghana', industry: 'Social Enterprise', location: 'Ghana', website: 'https://seghana.com' },
            { name: 'SEi Caledonia', industry: 'Social Enterprise', location: 'UK', website: 'https://seicaledonia.com' },
            { name: 'SEi Middle East', industry: 'Social Enterprise', location: 'Iraq', website: 'https://seimiddleeast.com' },
            { name: 'Solar Ear', industry: 'Social Enterprise', location: 'Brazil', website: 'https://solarear.com' },
            { name: 'Spark', industry: 'Social Enterprise', location: 'UK', website: 'https://spark.com' },
            { name: 'Supanova', industry: 'Social Enterprise', location: 'Indonesia', website: 'https://supanova.com' },
            { name: 'Sustainable Roots', industry: 'Social Enterprise', location: 'UK', website: 'https://sustainableroots.com' },
            { name: 'TTF', industry: 'Social Enterprise', location: 'UK', website: 'https://ttf.com' },
            { name: 'Terratai', industry: 'Social Enterprise', location: 'India', website: 'https://terratai.com' },
            { name: 'Universiti Malaya', industry: 'Social Enterprise', location: 'Malaysia', website: 'https://universitimalaya.com' },
            { name: 'Unyte Group', industry: 'Social Enterprise', location: 'Indonesia', website: 'https://unytegroup.com' },
            { name: 'Washking', industry: 'Social Enterprise', location: 'Ghana', website: 'https://washking.com' },
            { name: 'Whitby Shared Wealth', industry: 'Social Enterprise', location: 'UK', website: 'https://whitbysharedwealth.com' }
        ];
        let inserted = 0;
        for (const company of companies) {
            try {
                await DatabaseService.insert('companies', {
                    name: company.name,
                    industry: company.industry,
                    location: company.location,
                    website: company.website,
                    description: `${company.name} is a partner company of Shared Wealth International, committed to equitable wealth distribution and inclusive business practices.`,
                    status: 'approved',
                    is_active: true,
                    is_verified: true
                });
                inserted++;
            }
            catch (error) {
                console.log(`⚠️ Skipping ${company.name}`);
            }
        }
        const finalCount = await DatabaseService.query('SELECT COUNT(*) as count FROM companies WHERE 1=1');
        res.json({
            success: true,
            message: `Database populated successfully`,
            data: {
                inserted: inserted,
                totalCompanies: parseInt(finalCount.rows[0]?.count || 0)
            }
        });
    }
    catch (error) {
        console.error('❌ Database populate failed:', error);
        res.status(500).json({
            success: false,
            message: 'Database populate failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;
//# sourceMappingURL=setup.js.map