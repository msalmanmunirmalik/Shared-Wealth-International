# 🗄️ Shared Wealth International - Comprehensive Database Design

## 📋 Overview

This document describes the comprehensive database schema designed for the **Shared Wealth International** platform. The schema supports all features including user management, company networking, content management, funding platform, collaboration tools, and more.

## 🎯 Design Principles

1. **Scalability** - Designed to handle growth from hundreds to thousands of users and companies
2. **Flexibility** - JSONB fields for extensible metadata and configuration
3. **Performance** - Optimized indexes and views for common queries
4. **Data Integrity** - Foreign key constraints and check constraints
5. **Auditability** - Timestamps and activity logging throughout

## 🏗️ Schema Architecture

### Core Entities

#### 👥 User Management
- **`users`** - Core user profiles with enhanced fields
- **`user_companies`** - Many-to-many relationships between users and companies
- **`user_connections`** - Social connections between users

#### 🏢 Company Management
- **`companies`** - Enhanced company profiles with business model details
- **`company_connections`** - Business relationships between companies
- **`social_license_agreements`** - Shared Wealth licensing information

#### 📝 Content Management
- **`unified_content`** - Single table for all content types (news, posts, announcements, etc.)
- **`content_reactions`** - Likes, reactions, and engagement
- **`content_comments`** - Comment system with threading support

#### 💰 Funding Platform
- **`funding_opportunities`** - Available funding opportunities
- **`funding_applications`** - User/company funding applications

#### 🤝 Collaboration Tools
- **`projects`** - Collaborative projects and initiatives
- **`project_participants`** - Project team members and roles
- **`collaboration_meetings`** - Meeting scheduling and management

#### 💬 Social Features
- **`activity_feed`** - User activity timeline
- **`messages`** - Direct messaging system
- **`notifications`** - System notifications

#### 🗣️ Forum System
- **`forum_categories`** - Discussion categories
- **`forum_topics`** - Discussion topics
- **`forum_replies`** - Topic replies and discussions

#### 📁 File Management
- **`file_uploads`** - File storage and management

#### 🛠️ Business Tools
- **`business_canvas`** - Business model canvas data
- **`assessments`** - Various assessment results

#### 👨‍💼 Admin & Monitoring
- **`admin_activity_log`** - Admin action logging
- **`notifications`** - System-wide notifications

## 📊 Key Features Supported

### 1. **User & Authentication**
- Multi-role system (user, admin, superadmin, moderator)
- Email verification and account management
- User preferences and privacy settings
- Activity tracking and login history

### 2. **Company Management**
- Comprehensive company profiles
- Multi-country operations support
- Business model and revenue information
- Shared Wealth licensing integration
- Company status management (pending, approved, rejected)

### 3. **Social Networking**
- User-to-user connections (follow, friend, colleague, mentor)
- Company-to-company relationships (partnership, supplier, customer)
- Activity feeds and social engagement
- Direct messaging system

### 4. **Content Management**
- Unified content system supporting multiple types:
  - News articles
  - Company updates
  - Announcements
  - Collaboration posts
  - Events
  - Funding opportunities
  - Case studies
- Rich media support (images, videos, documents)
- SEO optimization (slugs, meta data)
- Content engagement metrics

### 5. **Funding Platform**
- Comprehensive funding opportunity management
- Detailed application tracking
- Business plan and document storage
- Review and approval workflow
- Funding metrics and analytics

### 6. **Collaboration Tools**
- Project management with milestones
- Team collaboration and role management
- Meeting scheduling and management
- Progress tracking and reporting

### 7. **Forum System**
- Categorized discussions
- Topic management with threading
- Moderation tools
- User engagement tracking

### 8. **Business Analytics**
- Business model canvas storage
- Assessment and evaluation results
- Impact measurement tools
- Performance metrics

### 9. **Admin Dashboard**
- Comprehensive admin controls
- Activity logging and audit trails
- System monitoring and metrics
- User and company management

## 🔍 Performance Optimizations

### Indexes
- **Primary indexes** on all foreign keys
- **Composite indexes** for common query patterns
- **Full-text search** indexes on content
- **GIN indexes** for JSONB fields

### Views
- **`user_profiles`** - Complete user information with companies
- **`company_profiles`** - Complete company information with team members

### Functions
- **`add_activity_feed_entry()`** - Standardized activity logging
- **`update_content_metrics()`** - Automatic engagement metric updates

### Triggers
- **`update_updated_at_column()`** - Automatic timestamp updates
- Applied to all relevant tables

## 📈 Scalability Considerations

### Database Design
- **UUID primary keys** for distributed systems
- **JSONB fields** for flexible metadata
- **Array fields** for multi-value attributes
- **Proper normalization** to reduce redundancy

### Performance
- **Optimized queries** with proper indexing
- **Pagination support** for large datasets
- **Caching strategies** for frequently accessed data
- **Connection pooling** for high concurrency

## 🔒 Security Features

### Data Protection
- **Password hashing** with bcrypt
- **Role-based access control**
- **Input validation** and sanitization
- **SQL injection prevention**

### Audit Trail
- **Comprehensive logging** of admin actions
- **User activity tracking**
- **Data change history**
- **Security event monitoring**

## 🚀 Migration Strategy

### Phase 1: Schema Setup
1. Run `setup-comprehensive-database.js` to create the complete schema
2. Verify all tables, indexes, and constraints are created
3. Confirm sample data is inserted

### Phase 2: Data Migration
1. Run `migrate-local-data.js` to transfer existing data
2. Verify data integrity and relationships
3. Test all functionality with migrated data

### Phase 3: Application Update
1. Update application code to use new schema
2. Test all features and functionality
3. Deploy to production environment

## 📋 Data Dictionary

### Core Tables

#### `users`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email address |
| password_hash | VARCHAR(255) | Hashed password |
| role | VARCHAR(50) | User role (user/admin/superadmin/moderator) |
| first_name | VARCHAR(100) | User's first name |
| last_name | VARCHAR(100) | User's last name |
| phone | VARCHAR(20) | Phone number |
| avatar_url | VARCHAR(500) | Profile picture URL |
| bio | TEXT | User biography |
| location | VARCHAR(255) | User location |
| is_active | BOOLEAN | Account status |
| email_verified | BOOLEAN | Email verification status |
| last_login | TIMESTAMP | Last login time |
| notification_preferences | JSONB | Notification settings |
| privacy_settings | JSONB | Privacy preferences |

#### `companies`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Company name |
| slug | VARCHAR(255) | SEO-friendly URL slug |
| description | TEXT | Company description |
| industry | VARCHAR(100) | Industry sector |
| sector | VARCHAR(100) | Business sector |
| size | VARCHAR(50) | Company size (startup/small/medium/large/enterprise) |
| employees | INTEGER | Number of employees |
| location | VARCHAR(255) | Company location |
| countries | TEXT[] | Array of operating countries |
| website | VARCHAR(255) | Company website |
| logo_url | VARCHAR(500) | Logo image URL |
| business_model | TEXT | Business model description |
| status | VARCHAR(50) | Approval status (pending/approved/rejected/suspended) |
| is_shared_wealth_licensed | BOOLEAN | Shared Wealth license status |
| license_number | VARCHAR(100) | License number |
| license_date | DATE | License issue date |

#### `unified_content`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| author_id | UUID | Content author |
| company_id | UUID | Associated company (optional) |
| title | VARCHAR(255) | Content title |
| slug | VARCHAR(255) | SEO-friendly URL slug |
| content | TEXT | Content body |
| type | VARCHAR(50) | Content type (news/update/announcement/etc.) |
| status | VARCHAR(50) | Publication status (draft/published/archived) |
| featured_image_url | VARCHAR(500) | Featured image URL |
| media_urls | JSONB | Additional media files |
| tags | TEXT[] | Content tags |
| categories | TEXT[] | Content categories |
| views_count | INTEGER | View count |
| likes_count | INTEGER | Like count |
| comments_count | INTEGER | Comment count |
| shares_count | INTEGER | Share count |
| is_featured | BOOLEAN | Featured content flag |
| published_at | TIMESTAMP | Publication date |

## 🎯 Next Steps

1. **Review the schema** and ensure it meets all requirements
2. **Run the setup script** to create the database structure
3. **Migrate existing data** using the migration script
4. **Update application code** to use the new schema
5. **Test thoroughly** before production deployment
6. **Monitor performance** and optimize as needed

## 📞 Support

For questions about the database design or migration process, please refer to the technical documentation or contact the development team.

---

**Last Updated:** September 16, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation
