import * as migration_20260507_141650_add_portfolio_hero_split_fields from './20260507_141650_add_portfolio_hero_split_fields'
import * as migration_20260512_114149_add_lens_collection from './20260512_114149_add_lens_collection'
import * as migration_20260522_022329_add_series_to_lens from './20260522_022329_add_series_to_lens'
import * as migration_20260602_122156_add_portfolio_hero_right_media from './20260602_122156_add_portfolio_hero_right_media'
import * as migration_20260602_133849_add_portfolio_hero_cdn_video_urls from './20260602_133849_add_portfolio_hero_cdn_video_urls'
import * as migration_20260605_032917 from './20260605_032917'
import * as migration_20260606_131310 from './20260606_131310'
import * as migration_20260830_122849_add_lens_archive_format from './20260830_122849_add_lens_archive_format'
import * as migration_20260901_081202_lens_taxonomies_and_detail from './20260901_081202_lens_taxonomies_and_detail'
import * as migration_20260902_023959_add_about_page_blocks from './20260902_023959_add_about_page_blocks'
import * as migration_20260902_072343 from './20260902_072343'
import * as migration_20260902_075703 from './20260902_075703'
import * as migration_20260903_000000_add_home_hero_image_stack from './20260903_000000_add_home_hero_image_stack'
import * as migration_20260903_140000_add_about_hero from './20260903_140000_add_about_hero'
import * as migration_20260903_160000_about_protocol_shared_quote from './20260903_160000_about_protocol_shared_quote'

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
    name: '20260606_131310',
  },
  {
    up: migration_20260830_122849_add_lens_archive_format.up,
    down: migration_20260830_122849_add_lens_archive_format.down,
    name: '20260830_122849_add_lens_archive_format',
  },
  {
    up: migration_20260901_081202_lens_taxonomies_and_detail.up,
    down: migration_20260901_081202_lens_taxonomies_and_detail.down,
    name: '20260901_081202_lens_taxonomies_and_detail',
  },
  {
    up: migration_20260902_023959_add_about_page_blocks.up,
    down: migration_20260902_023959_add_about_page_blocks.down,
    name: '20260902_023959_add_about_page_blocks',
  },
  {
    up: migration_20260902_072343.up,
    down: migration_20260902_072343.down,
    name: '20260902_072343',
  },
  {
    up: migration_20260902_075703.up,
    down: migration_20260902_075703.down,
    name: '20260902_075703',
  },
  {
    up: migration_20260903_000000_add_home_hero_image_stack.up,
    down: migration_20260903_000000_add_home_hero_image_stack.down,
    name: '20260903_000000_add_home_hero_image_stack',
  },
  {
    up: migration_20260903_140000_add_about_hero.up,
    down: migration_20260903_140000_add_about_hero.down,
    name: '20260903_140000_add_about_hero',
  },
  {
    up: migration_20260903_160000_about_protocol_shared_quote.up,
    down: migration_20260903_160000_about_protocol_shared_quote.down,
    name: '20260903_160000_about_protocol_shared_quote',
  },
]
