import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const STAKEBORG_DAO_DEFINITION = appDefinition({
  id: 'stakeborg-dao',
  name: 'StakeborgDAO',
  description: 'Governance and liquidity pools of StakeborgDAO',
  url: 'https://app.stakeborgdao.com/',
  groups: {},
  tags: [AppTag.ASSET_MANAGEMENT, AppTag.LIQUID_STAKING, AppTag.STAKING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(STAKEBORG_DAO_DEFINITION.id)
export class StakeborgDaoAppDefinition extends AppDefinition {
  constructor() {
    super(STAKEBORG_DAO_DEFINITION);
  }
}

export default STAKEBORG_DAO_DEFINITION;
