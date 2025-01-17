import { GasPrice } from '@cosmjs/stargate';

const DENOM = 'anom';
const DENOM_DECIMAL_PLACES = 18;
const STAKE_REWARD_PEAK_HEIGHT = 100;
const STAKE_REWARD_PEAK_POSITION = 150000000;
const STAKE_REWARD_STD_DEV = 50000000;
const ETH_BRIDGE_WAIT_BLOCKS = 14;
const TOTAL_COINS = 300000000;
const GAS_PRICE = GasPrice.fromString(`${0.001}${DENOM}`);

export const OnomyConstants = {
  DENOM,
  DENOM_DECIMAL_PLACES,
  STAKE_REWARD_PEAK_HEIGHT,
  STAKE_REWARD_PEAK_POSITION,
  STAKE_REWARD_STD_DEV,
  ETH_BRIDGE_WAIT_BLOCKS,
  TOTAL_COINS,
  GAS_PRICE,
};
