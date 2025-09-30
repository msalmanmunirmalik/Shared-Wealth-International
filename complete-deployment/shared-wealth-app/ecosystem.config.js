module.exports = {
  apps: [
    {
      name: 'shared-wealth-api',
      script: 'server/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
