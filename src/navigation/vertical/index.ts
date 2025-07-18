// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import ShieldOutline from 'mdi-material-ui/ShieldOutline'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline';
import AccountMultipleOutline from 'mdi-material-ui/AccountMultipleOutline';
import BullhornOutline from 'mdi-material-ui/BullhornOutline';
import FolderCogOutline from 'mdi-material-ui/FolderCogOutline'; // For Masters
import Earth from 'mdi-material-ui/Earth'; // For Countries
import OfficeBuildingOutline from 'mdi-material-ui/OfficeBuildingOutline'; // For Tenant
import MapMarkerRadiusOutline from 'mdi-material-ui/MapMarkerRadiusOutline'; // For Region
import StoreOutline from 'mdi-material-ui/StoreOutline'; // For Branch
import AccountLockOutline from 'mdi-material-ui/AccountLockOutline'; // For Role
import TuneVariant from 'mdi-material-ui/TuneVariant'; // For Features
import PackageVariantClosed from 'mdi-material-ui/PackageVariantClosed'; // For Products
import TagOutline from 'mdi-material-ui/TagOutline'; // For LeadCategory

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/home'
    },
    {
      title: 'Leads',
      icon: BullhornOutline,
      path: '/leads',
      access: 'lead'
    },
    {
      title: 'Clients',
      icon: AccountMultipleOutline,
      path: '/clients',
      access: 'lead'
    },
    {
      title: 'Users',
      icon: AccountGroupOutline,
      path: '/user',
      access: 'user'
    },
    {
      title: 'Masters',
      icon: FolderCogOutline,
      access: ['countries', 'region', 'role', 'branch', 'products', 'leadCategory'],
      children: [
        {
          title: 'Countries',
          icon: Earth,
          path: '/master/countries',
          access: 'countries'
        },
        {
          title: 'Region',
          icon: MapMarkerRadiusOutline,
          path: '/master/region',
          access: 'region'
        },
        {
          title: 'Branch',
          icon: StoreOutline,
          path: '/master/branch',
          access: 'branch'
        },
        {
          title: 'Role',
          icon: AccountLockOutline,
          path: '/master/role',
          access: 'role'
        },
        {
          title: 'Products',
          icon: PackageVariantClosed,
          path: '/master/products',
          access: 'product'
        },
        {
          title: 'Lead Category',
          icon: TagOutline,
          path: '/master/leadCategory',
          access: 'leadCategory'
        }
      ]
    }
  ]
}

export default navigation
