// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import ShieldOutline from 'mdi-material-ui/ShieldOutline'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/home'
    },
    {
      title: 'User',
      icon: EmailOutline,
      path: '/user',
      access: 'user'
    },
    {
      title: 'Leads',
      icon: EmailOutline,
      path: '/leads',
      access: 'lead'
    },
    {
      title: 'Access Control',
      icon: ShieldOutline,
      path: '/acl',
      action: 'read',
      subject: 'acl-page'
    },
    {
      title: 'Masters',
      icon: FolderSpecialIcon,
      access: ['countries', 'region', 'role', 'branch', 'products', 'leadCategory'],
      children: [
        {
          title: 'Countries',
          path: '/master/countries',
          access: 'countries'
        },
        {
          title: 'Tenant',
          path: '/master/tenant'
        },
        {
          title: 'Region',
          path: '/master/region',
          access: 'region'
        },
        {
          title: 'Branch',
          path: '/master/branch',
          access: 'branch'
        },
        {
          title: 'Role',
          path: '/master/role',
          access: 'role'
        },
        {
          title: 'Features',
          path: '/master/features'
        },
        {
          title: 'Products',
          path: '/master/products',
          access: 'products'
        },
        {
          title: 'LeadCategory',
          path: '/master/leadCategory',
          access: 'leadCategory'
        }
      ]
    }
  ]
}

export default navigation
