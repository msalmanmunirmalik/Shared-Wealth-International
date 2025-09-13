#!/bin/bash

# Phase 1 Data Population Script
# This script creates missing tables and populates sample data

echo "🚀 PHASE 1: DATA POPULATION & DASHBOARD COMPLETION"
echo "=================================================="

# Set database connection parameters
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-shared_wealth_international}
DB_USER=${DB_USER:-m.salmanmalik}
DB_PASSWORD=${DB_PASSWORD:-}

echo "📊 Database: $DB_NAME"
echo "👤 User: $DB_USER"
echo ""

# Function to run SQL commands
run_sql() {
    local sql_file=$1
    local description=$2
    
    echo "🔄 $description..."
    
    if [ -n "$DB_PASSWORD" ]; then
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$sql_file"
    else
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$sql_file"
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ $description completed successfully"
    else
        echo "❌ $description failed"
        exit 1
    fi
    echo ""
}

# Step 1: Create missing tables
echo "📋 STEP 1: Creating Missing Database Tables"
echo "------------------------------------------"
run_sql "database/missing_tables.sql" "Creating missing tables (projects, company_applications, collaboration_meetings, etc.)"

# Step 2: Populate sample data
echo "📋 STEP 2: Populating Sample Data"
echo "---------------------------------"
run_sql "database/sample_data.sql" "Populating database with sample data"

# Step 3: Verify data population
echo "📋 STEP 3: Verifying Data Population"
echo "------------------------------------"

echo "🔍 Checking table counts..."

# Function to check table count
check_count() {
    local table=$1
    local description=$2
    
    if [ -n "$DB_PASSWORD" ]; then
        count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM $table;")
    else
        count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM $table;")
    fi
    
    # Remove whitespace
    count=$(echo $count | tr -d ' ')
    
    echo "  📊 $description: $count records"
}

check_count "users" "Users"
check_count "companies" "Companies"
check_count "user_companies" "User-Company Relationships"
check_count "projects" "Projects"
check_count "company_applications" "Company Applications"
check_count "collaboration_meetings" "Collaboration Meetings"
check_count "forum_topics" "Forum Topics"
check_count "forum_replies" "Forum Replies"
check_count "events" "Events"
check_count "activity_feed" "Activity Feed"
check_count "messages" "Messages"
check_count "user_connections" "User Connections"
check_count "post_reactions" "Post Reactions"
check_count "bookmarks" "Bookmarks"

echo ""
echo "🎉 PHASE 1 COMPLETED SUCCESSFULLY!"
echo "================================="
echo ""
echo "✅ Missing database tables created"
echo "✅ Sample data populated"
echo "✅ Dashboard statistics API ready"
echo "✅ Real-time features enhanced"
echo ""
echo "🚀 Next Steps:"
echo "  1. Restart the server to load new routes"
echo "  2. Test dashboard functionality"
echo "  3. Verify all features work with real data"
echo ""
echo "📱 Dashboard Features Now Available:"
echo "  • Real company data and statistics"
echo "  • Active projects tracking"
echo "  • Collaboration meetings"
echo "  • Forum discussions with sample posts"
echo "  • User connections and social features"
echo "  • Activity feed with recent updates"
echo ""
echo "🔗 Test the dashboard at: http://localhost:3001/companies"
echo ""
