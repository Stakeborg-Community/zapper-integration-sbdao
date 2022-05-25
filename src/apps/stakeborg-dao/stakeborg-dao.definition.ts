import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag } from '~app/app.interface';
import { GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const STAKEBORG_DAO_DEFINITION = appDefinition({
  id: 'stakeborg-dao',
  name: 'stakeborg-dao',
  description: 'StakeborgDAO App',
  url: 'https://stakeborgdao.com/',
  groups: {
    indexes: {
      id: 'indexes',
      type: GroupType.TOKEN,
      label: 'Indexes',
    },
    staking: { id: 'staking', type: GroupType.POSITION, label: 'Governance' },
  },
  tags: [AppTag.ASSET_MANAGEMENT, AppTag.LIQUIDITY_POOL, AppTag.STAKING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
  token: {
    address: '0xda0c94c73d127ee191955fb46bacd7ff999b2bcd',
    network: Network.ETHEREUM_MAINNET,
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
