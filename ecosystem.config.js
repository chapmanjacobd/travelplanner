module.exports = {
  apps: [
    {
      name: 'API',
      script: './www',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args:
        'pm2_home=/home/api/bin/',
      cwd: '/home/api/bin/',
      error_file: './err.log',
      out_file: './out.log',
      // instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'admin',
      key: '/home/xk/.ssh/admin_rsa',
      host: 'unli.xyz',
      ref: 'origin/master',
      repo: 'git@bitbucket.org:xk3/travelplanner.git',
      cwd: '/home/api/bin',
      path: '/home/api',
      'post-deploy':
        'cd ~/api/current/ && git reset --hard && git pull && cd api && yarn install && ~/node_modules/pm2/bin/pm2 del API && ~/node_modules/pm2/bin/pm2 start npm --name API -- start --env production',
    },
  },
};
