import { Inject } from '@nestjs/common';
import axios, { Axios } from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';
import { GovernanceStaking, StakeborgDaoContractFactory } from '../contracts';

import { STAKEBORG_DAO_DEFINITION } from '../stakeborg-dao.definition';

const appId = STAKEBORG_DAO_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(STAKEBORG_DAO_DEFINITION.id, network)
export class EthereumStakeborgDaoBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StakeborgDaoContractFactory) private readonly stakeborgDaoContractFactory: StakeborgDaoContractFactory,
  ) {}

  private async getStakedBlanace(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<GovernanceStaking>({
      address,
      appId: appId,
      network: network,
      groupId: STAKEBORG_DAO_DEFINITION.groups.staking.id,
      resolveContract: ({ address, network }) =>
        this.stakeborgDaoContractFactory.governanceStaking({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => {
        return multicall.wrap(contract).balanceOf(address);
      },
      resolveRewardTokenBalances: async ({}) => {
        const endpoint = `https://std.kwix.xyz/reward?address=${address}`;
        const data = await axios.get(endpoint).then(r => r.data.data);
        return parseFloat(data.rewards[address]) * 10 ** 18;
      },
    });
  }

  async getBalances(address: string) {
    const [stakingBalance] = await Promise.all([this.getStakedBlanace(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Staking',
        assets: [...stakingBalance],
      },
    ]);
  }
}
