// ** Types
import { NavGroup, NavLink } from 'src/@core/layouts/types'
// Removed: import { NextRouter } from 'next/router'
// No direct equivalent for AppRouterInstance needed here if we only use pathname

/**
 * Check for URL queries as well for matching
 * Current URL & Item Path
 *
 * @param router - router instance (currently not used in this simplified version for App Router)
 * @param path - the path of the nav item
 * @param currentPathname - the current pathname from usePathname()
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleURLQueries = (router: unknown, path: string | undefined, currentPathname?: string): boolean => {
  if (path && currentPathname) {
    // Example: item.path = /apps/user/list, currentPathname = /apps/user/view/1
    // Check if currentPathname starts with item.path
    // Also, if item.path is not just '/', ensure currentPathname is not just '/' or that they are identical.
    if (path === '/') {
      return currentPathname === path;
    }

    // If path has query params, they are ignored in this basic check.
    // For a more robust solution, consider splitting path and query params.
    const pathWithoutQuery = path.split('?')[0];

    return currentPathname.startsWith(pathWithoutQuery)
  }

  return false
}

/**
 * Check if the given item has the given url
 * in one of its children
 *
 * @param item
 * @param currentURL
 */
export const hasActiveChild = (item: NavGroup, currentURL: string): boolean => {
  const { children } = item

  if (!children) {
    return false
  }

  for (const child of children) {
    if ((child as NavGroup).children) {
      if (hasActiveChild(child, currentURL)) {
        return true
      }
    }
    const childPath = (child as NavLink).path

    // Check if the child has a link and is active
    if (
      child &&
      childPath &&
      currentURL &&
      (childPath === currentURL || (currentURL.includes(childPath) && childPath !== '/'))
    ) {
      return true
    }
  }

  return false
}

/**
 * Check if this is a children
 * of the given item
 *
 * @param children
 * @param openGroup
 * @param currentActiveGroup
 */
export const removeChildren = (children: NavLink[], openGroup: string[], currentActiveGroup: string[]) => {
  children.forEach((child: NavLink) => {
    if (!currentActiveGroup.includes(child.title)) {
      const index = openGroup.indexOf(child.title)
      if (index > -1) openGroup.splice(index, 1)

      // @ts-ignore
      if (child.children) removeChildren(child.children, openGroup, currentActiveGroup)
    }
  })
}
