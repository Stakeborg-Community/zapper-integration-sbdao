import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GovernanceStaking, StakeborgDaoContractFactory } from '../contracts';
import { STAKEBORG_DAO_DEFINITION } from '../stakeborg-dao.definition';

const appId = STAKEBORG_DAO_DEFINITION.id;
const groupId = STAKEBORG_DAO_DEFINITION.groups.staking.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumStakeborgDaoStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StakeborgDaoContractFactory) private readonly stakeborgDaoContractFactory: StakeborgDaoContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<GovernanceStaking>({
      appId,
      groupId,
      network,
      resolveFarmAddresses: async () => ['0xbA319F6F6AC8F45E556918A0C9ECDDE64335265C'],
      resolveStakedTokenAddress: async () => Promise.resolve('0xda0c94c73d127ee191955fb46bacd7ff999b2bcd'),
      resolveRewardTokenAddresses: async () => Promise.resolve('0xda0c94c73d127ee191955fb46bacd7ff999b2bcd'),
      resolveFarmContract: opts => this.stakeborgDaoContractFactory.governanceStaking(opts),
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
