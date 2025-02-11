export const appendTenantId = (data: any) => {
  if (window.localStorage.getItem('userData')) {
    const userData: any = JSON.parse(window.localStorage.getItem('userData'))
    data.tenant_id = userData.tenant_id
  }
}

export const appendTenantToQuery = (query: any, column: string) => {
  if (window.localStorage.getItem('userData')) {
    const userData: any = JSON.parse(window.localStorage.getItem('userData'))
    query.push({
      column: `"${column}"."tenant_id"`,
      operator: '=',
      value: `${userData.tenant_id}`
    })
  }
}
