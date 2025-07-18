// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import ShieldOutline from 'mdi-material-ui/ShieldOutline'
import BullhornOutline from 'mdi-material-ui/BullhornOutline'
import AccountMultipleOutline from 'mdi-material-ui/AccountMultipleOutline';

// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Dashboard',
    icon: HomeOutline,
    path: '/home'
  },
  {
    title: 'Leads',
    icon: BullhornOutline,
    path: '/leads'
  },
  {
    title: 'Clients',
    icon: AccountMultipleOutline,
    path: '/clients'
  },
  {
    title: 'Access Control',
    icon: ShieldOutline,
    path: '/acl',
    action: 'read',
    subject: 'acl-page'
  }
]

export default navigation
