import BlankLayout from 'src/@core/layouts/BlankLayout'
import NotAuthorized from 'src/pages/401'

import { accessCheck } from '../../utils/accessCheck'

const AclGuard = ({ children, feature }) => {

  return (
  {
    accessCheck(feature) ?
    (<>{children}</>)
    :
    <BlankLayout>
    <NotAuthorized/>
    </BlankLayout>
  }
  )
}
