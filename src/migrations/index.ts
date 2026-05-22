import * as migration_20260507_141650_add_portfolio_hero_split_fields from './20260507_141650_add_portfolio_hero_split_fields';
import * as migration_20260512_114149_add_lens_collection from './20260512_114149_add_lens_collection';
import * as migration_20260522_022329_add_series_to_lens from './20260522_022329_add_series_to_lens';

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
    name: '20260522_022329_add_series_to_lens'
  },
];
