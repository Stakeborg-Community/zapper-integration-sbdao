import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { StakeborgDaoContractFactory } from './contracts';
import { StakeborgDaoAppDefinition, STAKEBORG_DAO_DEFINITION } from './stakeborg-dao.definition';

@Register.AppModule({
  appId: STAKEBORG_DAO_DEFINITION.id,
  providers: [StakeborgDaoAppDefinition, StakeborgDaoContractFactory],
})
export class StakeborgDaoAppModule extends AbstractApp() {}
