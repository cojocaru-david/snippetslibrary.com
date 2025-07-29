# Deploy with Docker Compose
This deployment relies on several docker containers.
To deploy, you must set your environment vars and execute the deploy-docker.sh file.

## Environment
Make sure all variables are set in server/.env
The following example assumes that you are deploying to localhost:80 (or just localhost).

```bash
# server/.env

# Database
# Replace "password_replace_me" here and in ../docker-compose.yml
DATABASE_URL=postgresql://postgres:password_replace_me@codesnippets_db:5432/snippetslibrary

# GitHub OAuth
# Get these at https://github.com/settings/developers
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# Replace localhost with your domain name
# Example: https://www.example.com/api/auth/callback
GITHUB_REDIRECT_URI=http://localhost/api/auth/callback

# Production environment
NODE_ENV=production

# JWT
# Make one with ``openssl rand -base64 24 | head -c 32``
JWT_SECRET=your_super_secret_jwt_key

# Domain name
# Example: example.com
FRONTEND_DOMAIN=localhost

# Frontend URL (for OAuth redirects)
# replace with your demain name
# Examples: https://www.example.com
FRONTEND_URL=http://localhost

# Backend PORT (do not change)
PORT=3001
```

## Deploy project
```bash
# The first time, get the rights.
chmod +x docker-deploy.sh

# Then deploy
./docker-deploy.sh
```

If you need to redeploy with a clean database run
> [!WARNING]  
> This will nuke your db, delete all data
```bash
.docker-deploy --clean-db
```
```
