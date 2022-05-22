import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { StakeborgDaoContractFactory } from '../contracts';
import { STAKEBORG_DAO_DEFINITION } from '../stakeborg-dao.definition';

const appId = STAKEBORG_DAO_DEFINITION.id;
const groupId = STAKEBORG_DAO_DEFINITION.groups.indexes.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStakeborgDaoIndexesTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StakeborgDaoContractFactory) private readonly stakeborgDaoContractFactory: StakeborgDaoContractFactory,
  ) {}

  async getPositions() {
    const indexes = ['0x0acC0FEE1D86D2cD5AF372615bf59b298D50cd69', '0xe00639a1f59b52773b7d39d9f9bef07f6248dbae'];
    const multicall = this.appToolkit.getMulticall(network);

    // We will build a token object for each jar address, using data retrieved on-chain with Ethers
    const tokens = await Promise.all(
      indexes.map(async address => {
        let contract;
        switch (address) {
          case '0x0acC0FEE1D86D2cD5AF372615bf59b298D50cd69':
            contract = this.stakeborgDaoContractFactory.ilsiToken({ address: address, network });
            break;
          case '0xe00639a1f59b52773b7d39d9f9bef07f6248dbae':
            contract = this.stakeborgDaoContractFactory.daoxToken({ address: address, network });
            break;
        }
        const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
        const indexToken = baseTokenDependencies.find(v => v.symbol === 'stETH')!;
        const [symbol, decimals, totalSupply] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);
        const supply = Number(totalSupply) / 10 ** decimals;
        const token: AppTokenPosition = {
          address,
          network,
          appId,
          groupId,
          symbol,
          decimals,
          supply,
          tokens: [],
          dataProps: {},
          pricePerShare: 1,
          price: indexToken.price,
          type: ContractType.APP_TOKEN,
          displayProps: {
            label: symbol,
            secondaryLabel: buildDollarDisplayItem(indexToken.price),
            images: [getTokenImg(address, network)],
          },
        };

        return token;
      }),
    );

    return tokens;
  }
}
