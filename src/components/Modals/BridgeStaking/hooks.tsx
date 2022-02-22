import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useOnomy } from 'context/chain/OnomyContext';
import { useAsyncPoll } from 'hooks/useAsyncPoll';

export function useValidator() {
  const { onomyClient, address } = useOnomy();
  const { id } = useParams();

  return useAsyncPoll(
    useCallback(async () => {
      if (!id) return { validator: null, delegation: null };
      const [validators, selfDelegation, delegationData, rewardsData] = await Promise.all([
        // TODO: more focused query?
        onomyClient.getValidators(),
        onomyClient.getSelfDelegation(id),
        address ? onomyClient.getDelegation(id, address) : Promise.resolve(null),
        address ? onomyClient.getRewardsForDelegator(address) : Promise.resolve(null),
      ]);
      const validatorData = validators.find(v => v.operator_address === id);
      if (!validatorData) return { validator: null, delegation: delegationData };
      const selfStakeRate = selfDelegation?.balance.amount.div(validatorData.tokens);
      const rewardItems = rewardsData?.rewards.find(v => v.validator_address === id);
      const rewardItem = rewardItems?.reward.find(r => r.denom === 'nom'); // TODO: don't hardcode?
      return {
        validator: validatorData,
        selfDelegation,
        selfStake: selfStakeRate ? selfStakeRate.toNumber() : 0,
        delegation: delegationData,
        rewards: rewardItem,
      };
    }, [onomyClient, id, address]),
    { validator: null, delegation: null, rewards: null, selfStake: 0 }
  );
}

export type ValidatorData = ReturnType<typeof useValidator>[0];