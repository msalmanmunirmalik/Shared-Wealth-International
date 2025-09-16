#!/usr/bin/env node

/**
 * Database Setup Script
 * Sets up PostgreSQL database for Shared Wealth International
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'shared_wealth_international',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? {
    rejectUnauthorized: false
  } : false,
};

console.log('🚀 Starting database setup...');
console.log('📊 Database Config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user
});

// Create database connection
const pool = new Pool(dbConfig);

async function setupDatabase() {
  let client;
  
  try {
    // Test connection
    console.log('🔌 Testing database connection...');
    client = await pool.connect();
    console.log('✅ Database connection successful');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('📖 Reading schema file:', schemaPath);
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Schema file loaded successfully');

    // Execute schema
    console.log('🏗️  Executing database schema...');
    await client.query(schemaSQL);
    console.log('✅ Database schema created successfully');

    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Insert sample data
    console.log('🌱 Inserting sample data...');
    await insertSampleData(client);
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

async function insertSampleData(client) {
  // Insert sample companies
  const sampleCompanies = [
    {
      name: 'EcoTech Solutions',
      description: 'Sustainable technology solutions for a greener future',
      industry: 'Technology',
      sector: 'Clean Technology',
      size: 'medium',
      location: 'San Francisco, CA',
      website: 'https://ecotech.example.com',
      countries: ['United States', 'Canada'],
      employees: 150,
      status: 'approved',
      is_shared_wealth_licensed: true,
      license_number: 'SW-2024-001',
      license_date: '2024-01-15',
      applicant_role: 'CEO',
      applicant_position: 'Chief Executive Officer'
    },
    {
      name: 'Green Energy Corp',
      description: 'Renewable energy solutions and sustainable practices',
      industry: 'Energy',
      sector: 'Renewable Energy',
      size: 'large',
      location: 'Austin, TX',
      website: 'https://greenenergy.example.com',
      countries: ['United States', 'Mexico'],
      employees: 500,
      status: 'approved',
      is_shared_wealth_licensed: true,
      license_number: 'SW-2024-002',
      license_date: '2024-02-01',
      applicant_role: 'Founder',
      applicant_position: 'Founder & CEO'
    },
    {
      name: 'Social Impact Ventures',
      description: 'Investing in companies that create positive social impact',
      industry: 'Finance',
      sector: 'Impact Investing',
      size: 'small',
      location: 'New York, NY',
      website: 'https://socialimpact.example.com',
      countries: ['United States'],
      employees: 25,
      status: 'pending',
      is_shared_wealth_licensed: false,
      applicant_role: 'Managing Partner',
      applicant_position: 'Managing Partner'
    }
  ];

  for (const company of sampleCompanies) {
    await client.query(`
      INSERT INTO companies (
        name, description, industry, sector, size, location, website,
        countries, employees, status, is_shared_wealth_licensed,
        license_number, license_date, applicant_role, applicant_position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT DO NOTHING
    `, [
      company.name, company.description, company.industry, company.sector,
      company.size, company.location, company.website, company.countries,
      company.employees, company.status, company.is_shared_wealth_licensed,
      company.license_number, company.license_date, company.applicant_role,
      company.applicant_position
    ]);
  }

  // Insert sample funding opportunities
  const sampleFunding = [
    {
      title: 'Sustainable Technology Innovation Fund',
      description: 'Funding for innovative sustainable technology solutions',
      category: 'Technology',
      amount: 1000000.00,
      currency: 'USD',
      application_deadline: '2024-12-31',
      requirements: 'Must be a registered company with sustainable technology focus',
      eligibility_criteria: 'Companies with proven track record in sustainability',
      status: 'active'
    },
    {
      title: 'Green Energy Development Grant',
      description: 'Grant for renewable energy project development',
      category: 'Energy',
      amount: 500000.00,
      currency: 'USD',
      application_deadline: '2024-11-30',
      requirements: 'Renewable energy project proposal required',
      eligibility_criteria: 'Early-stage renewable energy companies',
      status: 'active'
    }
  ];

  for (const funding of sampleFunding) {
    await client.query(`
      INSERT INTO funding_opportunities (
        title, description, category, amount, currency, application_deadline,
        requirements, eligibility_criteria, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT DO NOTHING
    `, [
      funding.title, funding.description, funding.category, funding.amount,
      funding.currency, funding.application_deadline, funding.requirements,
      funding.eligibility_criteria, funding.status
    ]);
  }

  // Insert sample news articles
  const sampleNews = [
    {
      title: 'Shared Wealth International Launches New Platform',
      content: 'We are excited to announce the launch of our new platform...',
      excerpt: 'Major platform launch announcement',
      author: 'Admin User',
      category: 'Announcements',
      tags: ['announcement', 'platform', 'launch'],
      status: 'published',
      published_at: new Date()
    },
    {
      title: 'Sustainable Business Practices Guide',
      content: 'A comprehensive guide to implementing sustainable business practices...',
      excerpt: 'Guide to sustainable business practices',
      author: 'Admin User',
      category: 'Resources',
      tags: ['sustainability', 'business', 'guide'],
      status: 'published',
      published_at: new Date()
    }
  ];

  for (const news of sampleNews) {
    await client.query(`
      INSERT INTO news_articles (
        title, content, excerpt, author, category, tags, status, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
    `, [
      news.title, news.content, news.excerpt, news.author,
      news.category, news.tags, news.status, news.published_at
    ]);
  }

  console.log('✅ Sample data inserted successfully');
}

// Run setup
setupDatabase()
  .then(() => {
    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  });
