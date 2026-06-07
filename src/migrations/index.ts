import * as migration_20260507_141650_add_portfolio_hero_split_fields from './20260507_141650_add_portfolio_hero_split_fields';
import * as migration_20260512_114149_add_lens_collection from './20260512_114149_add_lens_collection';
import * as migration_20260522_022329_add_series_to_lens from './20260522_022329_add_series_to_lens';
import * as migration_20260602_122156_add_portfolio_hero_right_media from './20260602_122156_add_portfolio_hero_right_media';
import * as migration_20260602_133849_add_portfolio_hero_cdn_video_urls from './20260602_133849_add_portfolio_hero_cdn_video_urls';
import * as migration_20260605_032917 from './20260605_032917';
import * as migration_20260606_131310 from './20260606_131310';

export const migrations = [
  {
    up: migration_20260507_141650_add_portfolio_hero_split_fields.up,
    down: migration_20260507_141650_add_portfolio_hero_split_fields.down,
    name: '20260507_141650_add_portfolio_hero_split_fields',
  },
  {
    up: migration_20260512_114149_add_lens_collection.up,
    down: migration_20260512_114149_add_lens_collection.down,
    name: '20260512_114149_add_lens_collection',
  },
  {
    up: migration_20260522_022329_add_series_to_lens.up,
    down: migration_20260522_022329_add_series_to_lens.down,
    name: '20260522_022329_add_series_to_lens',
  },
  {
    up: migration_20260602_122156_add_portfolio_hero_right_media.up,
    down: migration_20260602_122156_add_portfolio_hero_right_media.down,
    name: '20260602_122156_add_portfolio_hero_right_media',
  },
  {
    up: migration_20260602_133849_add_portfolio_hero_cdn_video_urls.up,
    down: migration_20260602_133849_add_portfolio_hero_cdn_video_urls.down,
    name: '20260602_133849_add_portfolio_hero_cdn_video_urls',
  },
  {
    up: migration_20260605_032917.up,
    down: migration_20260605_032917.down,
    name: '20260605_032917',
  },
  {
    up: migration_20260606_131310.up,
    down: migration_20260606_131310.down,
    name: '20260606_131310'
  },
];
