import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateHomepageCmsDto {
  @IsOptional()
  @IsString()
  heroBadge?: string;

  @IsOptional()
  @IsString()
  heroTitle?: string;

  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @IsOptional()
  @IsString()
  heroPrimaryCtaText?: string;

  @IsOptional()
  @IsString()
  heroPrimaryCtaLink?: string;

  @IsOptional()
  @IsString()
  heroSecondaryCtaText?: string;

  @IsOptional()
  @IsString()
  heroSecondaryCtaLink?: string;

  @IsOptional()
  @IsString()
  showcaseBadge?: string;

  @IsOptional()
  @IsString()
  showcaseTitle?: string;

  @IsOptional()
  @IsString()
  showcaseDescription?: string;

  @IsOptional()
  @IsArray()
  metrics?: Array<{
    value: string;
    label: string;
    sub: string;
    color?: string;
  }>;

  @IsOptional()
  @IsArray()
  testimonials?: Array<{
    author: string;
    role: string;
    badge: string;
    quote: string;
    stat: string;
    statLabel: string;
    avatar: string;
  }>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trustedBrands?: string[];

  @IsOptional()
  @IsString()
  clientCtaTitle?: string;

  @IsOptional()
  @IsString()
  clientCtaText?: string;

  @IsOptional()
  @IsString()
  talentCtaTitle?: string;

  @IsOptional()
  @IsString()
  talentCtaText?: string;
}
