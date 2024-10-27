export const checkAccess = (feature: string) => {
  const { features } = JSON.parse(window.localStorage.getItem('userData'))

  return features.includes(feature)
}
