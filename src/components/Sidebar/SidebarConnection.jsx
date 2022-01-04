import React from 'react';
import styled from 'styled-components';

import { ConnectionStatus } from '../UI';
import { responsive } from 'theme/constants';

const ConnectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 40px;

  @media screen and (max-width: ${responsive.laptop}) {
    padding: 24px;
  }

  @media screen and (max-width: ${responsive.tablet}) {
    grid-column: 2/3;
    grid-row: 1/2;
    flex-direction: row;
    gap: 40px;

    border-bottom: 1px solid ${props => props.theme.colors.bgHighlightBorder};
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: none;
  }
`;

const ConnectionRow = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: ${responsive.tablet}) {
    flex-direction: column;
    justify-content: flex-start;
    gap: 10px;
  }

  > strong {
    font-weight: 400;
    color: ${props => props.theme.colors.textSecondary};
    white-space: nowrap;
  }

  > span {
    font-weight: 500;
  }

  a {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export default function SidebarConnection({ active, error, chainId, blockNumber }) {
  return (
    <ConnectionWrapper>
      <ConnectionRow>
        <strong>Connection</strong>
        <ConnectionStatus active={active}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {active ? 'Connected' : error ? 'Error' : 'Loading'}
        </ConnectionStatus>
      </ConnectionRow>
      <ConnectionRow>
        <strong>Chain Id</strong>
        <span>{chainId ?? ''}</span>
      </ConnectionRow>
      <ConnectionRow>
        <strong>Block Number</strong>
        <span>{blockNumber ? blockNumber.toFixed(0) : ''}</span>
      </ConnectionRow>
      <ConnectionRow>
        <strong>Contract Address</strong>
        <span>
          <a href="https://etherscan.com" target="_blank" rel="noreferrer">
            Etherscan
          </a>
        </span>
      </ConnectionRow>
    </ConnectionWrapper>
  );
}
