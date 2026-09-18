/**
 * The shell's content column. Header, main nav and page content all align to it.
 * The panel and rules around it span the viewport; pages bring their own padding.
 */
export const appContainer = 'w-full';

export const appContainerPadded = `${appContainer} px-6`;

/**
 * A nav row indents by less than the container and gives the rest back to its items, so
 * row + item always totals the container's px-6 and every first label lands on the header's
 * logo edge. The two rows keep different item padding on purpose — the tab strip reads as
 * the primary row, the section strip as the secondary one. Below sm the tab strip shifts a
 * pixel of that budget from the item to the row, buying 2px per tab so the mobile strip
 * fits without scrolling while the first label stays on the logo edge. From md the tab strip
 * is inset by the full px-6, so the first tab itself starts on the logo edge.
 */
export const appTabsRow = `${appContainer} px-px sm:px-0 md:px-6`;

export const appTabsItemX = 'px-[23px] sm:px-6';

export const appSectionRow = `${appContainer} px-2.5`;

export const appSectionItemX = 'px-3.5';
