import * as migration_20260507_141650_add_portfolio_hero_split_fields from './20260507_141650_add_portfolio_hero_split_fields'

export const migrations = [
  {
    up: migration_20260507_141650_add_portfolio_hero_split_fields.up,
    down: migration_20260507_141650_add_portfolio_hero_split_fields.down,
    name: '20260507_141650_add_portfolio_hero_split_fields',
  },
]
