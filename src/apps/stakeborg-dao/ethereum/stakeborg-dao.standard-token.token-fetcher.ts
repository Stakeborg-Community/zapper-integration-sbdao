import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StakeborgDaoContractFactory } from '../contracts';
import { STAKEBORG_DAO_DEFINITION } from '../stakeborg-dao.definition';

const appId = STAKEBORG_DAO_DEFINITION.id;
const groupId = STAKEBORG_DAO_DEFINITION.groups.standardToken.id;
const network = Network.ETHEREUM_MAINNET;

const standardTokenContractAddress = "0xda0c94c73d127ee191955fb46bacd7ff999b2bcd";

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStakeborgDaoStandardTokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StakeborgDaoContractFactory) private readonly stakeborgDaoContractFactory: StakeborgDaoContractFactory,
  ) { }

  async getPositions() {
    const standardToken = await this.appToolkit.getBaseTokenPrice({ "network": network, "address": standardTokenContractAddress });
    console.log(standardToken);
    return standardToken as any;
  }
}
