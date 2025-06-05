module.exports = {
    apps: [{
      name: 'membership',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/membership-error.log',
      out_file: '/var/log/pm2/membership-out.log',
      log_file: '/var/log/pm2/membership.log'
    }]
  }