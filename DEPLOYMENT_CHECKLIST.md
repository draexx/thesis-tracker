# Deployment Checklist for Thesis Track & Compare

## Pre-Deployment

### Code Quality
- [ ] Run `npm run lint` and fix all errors
- [ ] Run `npm run build` locally to ensure no build errors
- [ ] Test all critical user flows (login, register, dashboard, ranking)
- [ ] Verify error pages (404, 500) display correctly
- [ ] Check responsive design on mobile, tablet, desktop

### Database
- [ ] Verify Prisma schema is up to date
- [ ] Test all database queries locally
- [ ] Create production database (Neon, Supabase, Railway, etc.)
- [ ] Note down production DATABASE_URL

### Environment Variables
- [ ] Generate production NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Prepare production NEXTAUTH_URL (your Vercel domain)
- [ ] Have DATABASE_URL ready for production

### Security
- [ ] Verify all API routes have proper authentication
- [ ] Check that sensitive data is not logged
- [ ] Ensure .env is in .gitignore
- [ ] Review security headers in vercel.json

## Vercel Setup

### Initial Configuration
- [ ] Create new project in Vercel
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Framework Preset: Next.js
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

### Environment Variables in Vercel
Add the following in Project Settings → Environment Variables:

- [ ] `DATABASE_URL` = your production database URL
- [ ] `NEXTAUTH_SECRET` = generated secret
- [ ] `NEXTAUTH_URL` = https://your-domain.vercel.app

### Deploy
- [ ] Trigger first deployment
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors

## Post-Deployment

### Database Migration
```bash
# Connect to your production database and run migrations
npx prisma migrate deploy
```

- [ ] Run migrations in production
- [ ] (Optional) Run seed if needed: `npx prisma db seed`

### Verification
- [ ] Visit production URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Verify dashboard loads correctly
- [ ] Check ranking page
- [ ] Test creating/updating thesis progress
- [ ] Verify advisor dashboard
- [ ] Test logout functionality

### Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify images are optimized
- [ ] Test page load times

### Monitoring
- [ ] Set up error tracking (optional: Sentry)
- [ ] Configure Vercel Analytics (if using)
- [ ] Monitor initial traffic and errors

### DNS & Domain (if using custom domain)
- [ ] Add custom domain in Vercel
- [ ] Configure DNS records
- [ ] Wait for SSL certificate
- [ ] Update NEXTAUTH_URL to custom domain
- [ ] Redeploy after URL change

## Post-Launch

### Week 1
- [ ] Monitor error logs daily
- [ ] Check database performance
- [ ] Gather user feedback
- [ ] Fix critical bugs

### Ongoing
- [ ] Set up automated backups for database
- [ ] Plan regular dependency updates
- [ ] Monitor security advisories
- [ ] Review and optimize slow queries

## Rollback Plan

If something goes wrong:

1. **Vercel**: Use "Redeploy" on previous successful deployment
2. **Database**: Have backup ready before major migrations
3. **Environment Variables**: Keep backup of working configuration

## Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Database Provider**: [Your provider's support]
- **Repository**: https://github.com/draexx/thesis-tracker

---

**Last Updated**: 2025-12-04
