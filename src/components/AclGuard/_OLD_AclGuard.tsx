'use client';
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Error401Page from 'src/app/401/page' // Updated import path and component name

import { checkAccess } from 'src/utils/accessCheck'

const AclGuard = ({ children, feature }) => {
  return (
    <>
      {checkAccess(feature) ? (
        <>{children}</>
      ) : (
        <BlankLayout>
          <Error401Page />
        </BlankLayout>
      )}
    </>
  )
}

export default AclGuard
