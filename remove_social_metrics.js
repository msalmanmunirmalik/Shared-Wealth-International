const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/pages/UserDashboard.tsx', 'utf8');

// Remove social metrics from DashboardStats interface
content = content.replace(/\/\/ Social Metrics\s*\n\s*totalReactions: number;\s*\n\s*totalShares: number;\s*\n\s*totalConnections: number;\s*\n\s*socialEngagement: number;/, '');

// Remove social metrics initialization
content = content.replace(/\/\/ Social Metrics\s*\n\s*totalReactions: 0,\s*\n\s*totalShares: 0,\s*\n\s*totalConnections: 0,\s*\n\s*socialEngagement: 0/, '');

// Remove social metrics cards from overview tab
content = content.replace(/\/\* Social Metrics Cards \*\/[\s\S]*?<\/Card>\s*<\/div>/g, '</div>');

// Remove social analytics from social tab
content = content.replace(/\/\* Social Analytics \*\/[\s\S]*?<\/Card>\s*<\/div>/g, '</div>');

// Remove social metrics from loadSocialMetrics function
content = content.replace(/\/\/ Social metrics are disabled until APIs are properly implemented[\s\S]*?socialEngagement: 0\s*\}\);/, '');

// Write the file back
fs.writeFileSync('src/pages/UserDashboard.tsx', content);

console.log('Social metrics removed successfully!');
