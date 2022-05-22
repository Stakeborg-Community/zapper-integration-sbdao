import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { StakeborgDaoContractFactory } from './contracts';
import { EthereumStakeborgDaoBalanceFetcher } from './ethereum/stakeborg-dao.balance-fetcher';
import { EthereumStakeborgDaoIndexesTokenFetcher } from './ethereum/stakeborg-dao.indexes.token-fetcher';
import { EthereumStakeborgDaoStakingContractPositionFetcher } from './ethereum/stakeborg-dao.staking.contract-position-fetcher';
import { StakeborgDaoAppDefinition, STAKEBORG_DAO_DEFINITION } from './stakeborg-dao.definition';

@Register.AppModule({
  appId: STAKEBORG_DAO_DEFINITION.id,
  providers: [
    EthereumStakeborgDaoBalanceFetcher,
    EthereumStakeborgDaoIndexesTokenFetcher,
    EthereumStakeborgDaoStakingContractPositionFetcher,
    StakeborgDaoAppDefinition,
    StakeborgDaoContractFactory,
  ],
})
export class StakeborgDaoAppModule extends AbstractApp() {}
