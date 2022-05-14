import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { StakeborgDaoContractFactory } from './contracts';
import { EthereumStakeborgDaoStandardTokenTokenFetcher } from './ethereum/stakeborg-dao.standard-token.token-fetcher';
import { StakeborgDaoAppDefinition, STAKEBORG_DAO_DEFINITION } from './stakeborg-dao.definition';

@Register.AppModule({
  appId: STAKEBORG_DAO_DEFINITION.id,
  providers: [EthereumStakeborgDaoStandardTokenTokenFetcher, StakeborgDaoAppDefinition, StakeborgDaoContractFactory],
})
export class StakeborgDaoAppModule extends AbstractApp() {}
