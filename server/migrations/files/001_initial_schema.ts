import { DatabaseService } from '../../services/databaseService.js';
import type { Migration } from '../migrationRunner.js';

const migration: Migration = {
  version: '001',
  name: 'initial_schema',
  
  async up(db: DatabaseService) {
    console.log('Creating initial database schema...');
    
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Companies table
    await db.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        website VARCHAR(255),
        sector VARCHAR(100),
        location VARCHAR(255),
        logo_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'pending',
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User companies relationship table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        position VARCHAR(100),
        is_primary BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'active',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, company_id)
      )
    `);

    // Company applications table
    await db.query(`
      CREATE TABLE IF NOT EXISTS company_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255) NOT NULL,
        company_description TEXT,
        company_website VARCHAR(255),
        company_sector VARCHAR(100),
        company_location VARCHAR(255),
        applicant_position VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // News articles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS news_articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_id UUID REFERENCES users(id),
        company_id UUID REFERENCES companies(id),
        image_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'published',
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Events table
    await db.query(`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date TIMESTAMP NOT NULL,
        location VARCHAR(255),
        organizer_id UUID REFERENCES users(id),
        company_id UUID REFERENCES companies(id),
        max_attendees INTEGER,
        registration_required BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Funding opportunities table
    await db.query(`
      CREATE TABLE IF NOT EXISTS funding_opportunities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        amount_min DECIMAL(15,2),
        amount_max DECIMAL(15,2),
        currency VARCHAR(3) DEFAULT 'USD',
        deadline DATE,
        organization VARCHAR(255),
        contact_email VARCHAR(255),
        requirements TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Activity feed table
    await db.query(`
      CREATE TABLE IF NOT EXISTS activity_feed (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await db.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_news_articles_author_id ON news_articles(author_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_news_articles_company_id ON news_articles(company_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON activity_feed(user_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at)');

    console.log('✅ Initial schema created successfully');
  },

  async down(db: DatabaseService) {
    console.log('Dropping initial database schema...');
    
    // Drop tables in reverse order to handle foreign key constraints
    await db.query('DROP TABLE IF EXISTS activity_feed CASCADE');
    await db.query('DROP TABLE IF EXISTS funding_opportunities CASCADE');
    await db.query('DROP TABLE IF EXISTS events CASCADE');
    await db.query('DROP TABLE IF EXISTS news_articles CASCADE');
    await db.query('DROP TABLE IF EXISTS company_applications CASCADE');
    await db.query('DROP TABLE IF EXISTS user_companies CASCADE');
    await db.query('DROP TABLE IF EXISTS companies CASCADE');
    await db.query('DROP TABLE IF EXISTS users CASCADE');

    console.log('✅ Initial schema dropped successfully');
  }
};

export default migration;
