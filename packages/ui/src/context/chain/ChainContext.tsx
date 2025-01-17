import React from 'react';
import { OnomyEthProvider, useOnomyEth } from '@onomy/react-eth';
import { OnomyProvider } from '@onomy/react-client';

import {
  KEPLR_CONFIG,
  REACT_APP_BONDING_NOM_CONTRACT_ADDRESS,
  REACT_APP_GRAPHQL_ENDPOINT,
  REACT_APP_GRAVITY_CONTRACT_ADDRESS,
  REACT_APP_WNOM_CONTRACT_ADDRESS,
} from 'constants/env';

function OnomyChildProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { blockNumber } = useOnomyEth();

  return (
    <OnomyProvider chainInfo={KEPLR_CONFIG} ethBlockNumber={blockNumber}>
      {children}
    </OnomyProvider>
  );
}

export function AppProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <OnomyEthProvider
      graphQlEndpoint={REACT_APP_GRAPHQL_ENDPOINT}
      nomContractAddress={REACT_APP_WNOM_CONTRACT_ADDRESS}
      bondContractAddress={REACT_APP_BONDING_NOM_CONTRACT_ADDRESS}
      gravityContractAddress={REACT_APP_GRAVITY_CONTRACT_ADDRESS}
    >
      <OnomyChildProvider>{children}</OnomyChildProvider>
    </OnomyEthProvider>
  );
}

export default AppProvider;
