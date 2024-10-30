import BlankLayout from 'src/@core/layouts/BlankLayout'
import NotAuthorized from 'src/pages/401'

import { checkAccess } from 'src/pages/utils/accessCheck'

const AclGuard = ({ children, feature }) => {
  return (
    <>
      {checkAccess(feature) ? (
        <>{children}</>
      ) : (
        <BlankLayout>
          <NotAuthorized />
        </BlankLayout>
      )}
    </>
  )
}

export default AclGuard
