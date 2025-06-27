// ** Types
import { NavGroup, NavLink } from 'src/@core/layouts/types'; // Keep NavLink if used by hasActiveChild
import { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Check for URL queries as well for matching
 * Current URL & Item Path
 *
 * @param pathname The current route's pathname
 * @param searchParams The current route's searchParams object
 * @param itemPath The path of the navigation item to check
 */
export const handleURLQueries = (pathname: string, searchParams: ReadonlyURLSearchParams, itemPath: string | undefined): boolean => {
  if (itemPath === undefined || itemPath === null) { // Added null check for robustness
    return false;
  }

  // This function is meant to decide if a link should be "active" based on URL queries.
  // The original logic was:
  // if (Object.keys(router.query).length && path) {
  //   const arr = Object.keys(router.query);
  //   return router.asPath.includes(path) && router.asPath.includes(router.query[arr[0]] as string) && path !== '/';
  // }
  // This is difficult to translate directly and its intent is unclear.
  // A common use case is a link is active if its path matches AND specific query params also match.
  // For example, itemPath = "/products?category=electronics"
  // If itemPath does NOT contain query parameters itself, then this function probably shouldn't mark it active based on *current* URL queries alone,
  // unless the current URL query is what defines its active state.

  // Given the ambiguity and potential for over-complication,
  // we'll stick to a path-focused check here. If query-specific active states are needed,
  // the NavLink item definition itself should ideally specify those required queries.
  // The VerticalNavLink's useEffect already handles basic path and startsWith matching.
  // This function could be used for more complex query-based matching if defined.

  // For now, returning false as the primary active logic is in VerticalNavLink's useEffect.
  // If a NavLink item *itself* has a query string (e.g., item.path = '/foo?bar=true'),
  // then the `pathname === item.path` check in `VerticalNavLink` would handle exact matches including query strings.
  // This function seems intended for when `item.path` is a base path, and its active state depends on *additional* queries in the URL.

  // Example: item.path = "/items". Should it be active if URL is "/items?type=A"?
  // The current logic in VerticalNavLink (pathname.startsWith(item.path + '/')) handles parent routes.
  // If item.path = "/items" and current = "/items?type=A", pathname is "/items", item.path is "/items".
  // pathname === item.path will be true.

  // This function seems redundant if VerticalNavLink handles its own active state well.
  // Let's assume for now if item.path does not contain query params, its active state does not depend on current query params.
  // If item.path *does* contain query params (e.g. "/foo?id=123"), then a direct comparison of
  // pathname and searchParams.toString() against item.path would be needed.

  // To make this useful, it should probably check if itemPath itself contains query parameters
  // and if the current URL's query parameters satisfy those.

  // Simplified: if itemPath (which is just a path string) matches the current pathname, it's a candidate.
  // The query matching part of the original was too specific.
  // Let's assume this function is for cases where the nav item *path* itself doesn't fully capture active state.
  // For example, if multiple query param variations of a page should all make the same nav link active.
  // Given the current implementation in VerticalNavLink, this function might not be strictly necessary
  // for basic active states.

  // Defaulting to a behavior that doesn't interfere with VerticalNavLink's primary logic:
  return false;
};


/**
 * Check if the given item has the given url
 * in one of its children
 *
 * @param item
 * @param currentURL
 */
export const hasActiveChild = (item: NavGroup, currentURL: string): boolean => {
  const { children } = item;

  if (!children) {
    return false;
  }

  for (const child of children) {
    if ((child as NavGroup).children) {
      if (hasActiveChild(child as NavGroup, currentURL)) { // Cast child to NavGroup
        return true;
      }
    }
    const childPath = (child as NavLink).path;

    // Check if the child has a link and is active
    if (
      child &&
      childPath &&
      currentURL &&
      (childPath === currentURL || (currentURL.startsWith(childPath) && childPath !== '/')) // Use startsWith for parent paths
    ) {
      return true;
    }
  }

  return false;
};

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
      const index = openGroup.indexOf(child.title);
      if (index > -1) openGroup.splice(index, 1);

      const childAsGroup = child as NavGroup; // Type assertion
      if (childAsGroup.children) removeChildren(childAsGroup.children, openGroup, currentActiveGroup);
    }
  });
};
