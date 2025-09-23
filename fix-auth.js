// Quick fix script to inject correct authentication
const correctToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NDY4MjI2OC05MGU3LTRjZTMtYjA1NC04MzMxYjgyMWZjMTIiLCJlbWFpbCI6ImFkbWluQHNoYXJlZHdlYWx0aC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTc3MTA1NzgsImV4cCI6MTc1Nzc5Njk3OCwiYXVkIjoid2VhbHRoLXBpb25lZXJzLXVzZXJzIiwiaXNzIjoid2VhbHRoLXBpb25lZXJzLW5ldHdvcmsifQ.HXWgdYesSvIZo0PTZLco7K2HTKRVeRZfKoBub2i59tM";

const correctSession = {
  user: {
    id: "54682268-90e7-4ce3-b054-8331b821fc12",
    email: "admin@sharedwealth.com",
    role: "admin",
    created_at: "2025-08-17T17:10:52.043Z"
  },
  access_token: correctToken
};

console.log("🔧 Injecting correct authentication data...");

// Clear old data
localStorage.removeItem('session');
localStorage.removeItem('user');
localStorage.removeItem('isAdmin');
localStorage.removeItem('isDemoMode');

// Set correct data
localStorage.setItem('session', JSON.stringify(correctSession));
localStorage.setItem('user', JSON.stringify(correctSession.user));
localStorage.setItem('isAdmin', 'true');
localStorage.setItem('isDemoMode', 'false');

console.log("✅ Authentication fixed! Refreshing page...");
location.reload();
