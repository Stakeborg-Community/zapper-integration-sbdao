import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StakeborgDaoContractFactory } from '../contracts';
import { STAKEBORG_DAO_DEFINITION } from '../stakeborg-dao.definition';

const appId = STAKEBORG_DAO_DEFINITION.id;
const groupId = STAKEBORG_DAO_DEFINITION.groups.indexes.id;
const network = Network.ETHEREUM_MAINNET;

const indexes = [
  { address: '0x0acC0FEE1D86D2cD5AF372615bf59b298D50cd69', symbol: 'ILSI' },
  { address: '0xe00639a1f59b52773b7d39d9f9bef07f6248dbae', symbol: 'DAOX' },
];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStakeborgDaoIndexesTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StakeborgDaoContractFactory) private readonly stakeborgDaoContractFactory: StakeborgDaoContractFactory,
  ) {}

  async getPositions() {
    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    const tokens = await Promise.all(
      indexes.map(async index => {
        const contract = this.stakeborgDaoContractFactory.erc20({ address: index.address, network });

        const multicall = this.appToolkit.getMulticall(network);

        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        const underlyingToken = baseTokenDependencies.find(v => v.symbol === symbol);

        if (!underlyingToken) {
          return [] as any;
        }

        const supply = Number(supplyRaw) / 10 ** decimals;

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: index.address,
          network,
          symbol,
          decimals,
          supply,
          tokens: [underlyingToken],
          price: underlyingToken.price,
          pricePerShare: 1,
          dataProps: {},
          displayProps: {
            label: index.symbol,
            secondaryLabel: buildDollarDisplayItem(underlyingToken.price),
            images: [getTokenImg(underlyingToken.address, network)],
          },
        };

        return token;
      }),
    );

    return tokens;
  }
}
