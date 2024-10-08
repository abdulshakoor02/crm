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
      path: '/user'
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
      children: [
        {
          title: 'Countries',
          path: '/master/countries'
        },
        {
          title: 'Tenant',
          path: '/master/tenant'
        },
        {
          title: 'Region',
          path: '/master/region'
        },
        {
          title: 'Branch',
          path: '/master/branch'
        },
        {
          title: 'Role',
          path: '/master/role'
        }
      ]
    }
  ]
}

export default navigation
