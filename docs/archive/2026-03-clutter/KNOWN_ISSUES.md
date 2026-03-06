# Known Issues - March 2, 2026

## Critical Issue: Application Returns "Internal Server Error"

### Symptom
All requests to the app (HTTP `http://localhost:3030/`) return plain-text "Internal Server Error" with HTTP 500 status.

### Details
- **Status**: App reports "[startup] ✓ Ready"
- **Database**: Migrated successfully, tables exist
- **Startup**: Completes without errors
- **Requests**: All return generic 500 error

### Root Cause Analysis
The issue occurs AFTER startup completes, during request handling. The generic error message suggests:
1. Global error handler catching exceptions and returning plain text
2. Problem is systematic, not endpoint-specific
3. Request processing failing before responses are generated

### Troubleshooting Steps Attempted
✅ Checked environment variables (set correctly)
✅ Verified database connectivity (works, migrations applied)
✅ Verified Prisma client (database operations work at startup)
✅ Disabled agents via DISABLE_AGENTS=true
✅ Set NODE_ENV=development explicitly
✅ Restarted app multiple times
✅ Full rebuild with clean volumes
✅ Checked route handlers exist in build

### Possible Root Causes
1. **Global error handler misconfigured** - Not properly formatting error responses
2. **Middleware error** - Something in request chain failing
3. **Unhandled promise rejection** - Caught by Next.js error handler
4. **Build artifact issue** - Something wrong with production build output
5. **Environment variable missing** - Critical env var needed but not set

### Files to Investigate
- `/app/layout.tsx` - Root layout, calls initAgents()
- `/app/error.tsx` - Global error boundary (client-side)
- `/next.config.ts` - Next.js configuration
- `middleware.ts` (if exists) - Request middleware
- Environment variable setup in docker-compose

### Known Working
✅ App starts successfully
✅ Listens on port 3030
✅ Database migrations run
✅ Startup code executes (FakeStore sync attempted)
✅ Container port mapping correct

### Workaround
Until this is fixed, the system has full working infrastructure:
- PostgreSQL with both databases created and seeded
- All tables exist with correct schema
- Test users created with passwords
- HR system set up with admin accounts
- All authentication logic in place

---

## Secondary Issues (Already Fixed or Non-Critical)

### Registration Endpoint
- **Issue**: /api/register returns 500 error
- **Impact**: New users can't self-register via form
- **Workaround**: Create users via SQL INSERT or admin panel
- **Status**: Debugging in progress, error logging added

### Related
See `FIXES_SUMMARY_MARCH2.md` for complete list of 8 issues addressed.

---

## Next Actions

1. **Priority 1**: Debug the generic 500 error
   - Enable detailed Next.js logging
   - Check if it's a Prisma initialization issue
   - Verify all dependencies are installed in production build

2. **Priority 2**: Test with dev mode
   - `./scripts/start-all.sh` for local dev server
   - This may reveal if issue is specific to production build mode

3. **Priority 3**: Roll back changes if necessary
   - Check git log for when app last worked
   - Review recent changes that might have broken it

---

**Generated**: March 2, 2026
**Status**: 🔴 BLOCKER - App returns errors
**Infrastructure**: ✅ Ready (databases, users, config all set up)
