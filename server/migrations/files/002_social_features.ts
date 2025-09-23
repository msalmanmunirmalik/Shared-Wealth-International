import { DatabaseService } from '../../services/databaseService.js';
import type { Migration } from '../migrationRunner.js';

const migration: Migration = {
  version: '002',
  name: 'social_features',
  
  async up(db: DatabaseService) {
    console.log('Adding social features tables...');
    
    // Post reactions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS post_reactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        reaction_type VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, entity_type, entity_id)
      )
    `);

    // User connections table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_connections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id),
        CHECK(follower_id != following_id)
      )
    `);

    // Content shares table
    await db.query(`
      CREATE TABLE IF NOT EXISTS content_shares (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Unified content table
    await db.query(`
      CREATE TABLE IF NOT EXISTS unified_content (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
        content_type VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        content TEXT NOT NULL,
        image_url VARCHAR(500),
        metadata JSONB,
        is_published BOOLEAN DEFAULT false,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for social features
    await db.query('CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_post_reactions_entity ON post_reactions(entity_type, entity_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_user_connections_follower_id ON user_connections(follower_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_user_connections_following_id ON user_connections(following_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_content_shares_user_id ON content_shares(user_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_content_shares_entity ON content_shares(entity_type, entity_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_unified_content_author_id ON unified_content(author_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_unified_content_company_id ON unified_content(company_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_unified_content_published ON unified_content(is_published, published_at)');

    console.log('✅ Social features tables created successfully');
  },

  async down(db: DatabaseService) {
    console.log('Dropping social features tables...');
    
    await db.query('DROP TABLE IF EXISTS unified_content CASCADE');
    await db.query('DROP TABLE IF EXISTS content_shares CASCADE');
    await db.query('DROP TABLE IF EXISTS user_connections CASCADE');
    await db.query('DROP TABLE IF EXISTS post_reactions CASCADE');

    console.log('✅ Social features tables dropped successfully');
  }
};

export default migration;
