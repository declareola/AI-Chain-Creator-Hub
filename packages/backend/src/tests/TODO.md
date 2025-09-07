# TODO List for Backend Project

## Completed
- Fixed route order in `src/routes/nft.ts` to ensure `/nfts/user` is matched before `/nfts/:id`.
- Verified NFT endpoints and tests are passing.
- Cleaned up debug logs in `src/controllers/nftController.ts` and `src/middleware/auth.ts`.
- Fixed notification test URL paths from `/api/notification/*` to `/api/notifications/*`.
- Fixed notification route registration (removed double `/api` prefix).
- Notification tests: 7/9 passing (2 failing due to Push Protocol SDK configuration).

## Pending
- Investigate and fix failing tests in:
  - Marketplace tests (`src/tests/market.test.ts`) - 404 errors on marketplace listing endpoints.
  - Marketplace tests (`src/tests/market.test.ts`) - 404 errors on marketplace listing endpoints.
  - VibeCoin tests (`src/tests/vibe.test.ts`) - balance and transfer related failures.
  - AI generation tests (`src/tests/ai.test.ts`) - some GET requests returning 404 or empty results.
  - Integration tests (`src/tests/integration.test.ts`) - some end-to-end workflows failing.

## Next Steps
- Review route definitions and handlers for notification, marketplace, vibe, and AI modules.
- Ensure routes are correctly registered in `src/routes/index.ts`.
- Verify middleware and authentication for these routes.
- Check database seeding or test setup for required data.
- Run tests incrementally after fixes to isolate issues.
