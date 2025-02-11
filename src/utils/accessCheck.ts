export const checkAccess = (feature: string) => {
  if (typeof window === 'undefined') {
    return false
  }
  const { features } = JSON.parse(window.localStorage.getItem('userData') as unknown as string)

  return features.includes(feature)
}
