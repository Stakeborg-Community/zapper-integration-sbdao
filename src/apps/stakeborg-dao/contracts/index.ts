import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { DaoxToken__factory } from './ethers';
import { GovernanceStaking__factory } from './ethers';
import { IlsiToken__factory } from './ethers';
import { StandardToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class StakeborgDaoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  daoxToken({ address, network }: ContractOpts) {
    return DaoxToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  governanceStaking({ address, network }: ContractOpts) {
    return GovernanceStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ilsiToken({ address, network }: ContractOpts) {
    return IlsiToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  standardToken({ address, network }: ContractOpts) {
    return StandardToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { DaoxToken } from './ethers';
export type { GovernanceStaking } from './ethers';
export type { IlsiToken } from './ethers';
export type { StandardToken } from './ethers';
