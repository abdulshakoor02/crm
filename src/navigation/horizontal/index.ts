// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import ShieldOutline from 'mdi-material-ui/ShieldOutline'
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline';

// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Home',
    icon: HomeOutline,
    path: '/home'
  },
  {
    title: 'Second Page',
    icon: FileDocumentOutline,
    path: '/second-page'
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
