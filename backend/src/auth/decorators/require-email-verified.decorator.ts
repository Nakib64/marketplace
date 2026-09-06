import { SetMetadata } from '@nestjs/common';

export const REQUIRE_EMAIL_VERIFIED_KEY = 'require_email_verified';

export const RequireEmailVerified = () =>
  SetMetadata(REQUIRE_EMAIL_VERIFIED_KEY, true);
