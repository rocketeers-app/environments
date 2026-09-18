import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface PageActionsContextValue {
    container: HTMLElement | null;
    setContainer: (element: HTMLElement | null) => void;
}

const PageActionsContext = createContext<PageActionsContextValue | null>(null);

const noop = () => {};

/**
 * Hosts the page's own actions in its title row rather than wherever they are declared.
 * `PageHeader` registers the slot it renders them into and the page portals into it, so
 * the buttons keep the page's state and handlers while sitting beside the heading.
 */
export function PageActionsProvider({ children }: PropsWithChildren) {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    const value = useMemo(() => ({ container, setContainer }), [container]);

    return (
        <PageActionsContext.Provider value={value}>
            {children}
        </PageActionsContext.Provider>
    );
}

export function usePageActionsSlot(): Pick<
    PageActionsContextValue,
    'setContainer'
> {
    const context = useContext(PageActionsContext);

    return { setContainer: context?.setContainer ?? noop };
}

/**
 * Renders its children at the right edge of the page's title row. A page wraps whatever
 * belongs top-right of its heading in this; nothing renders where it is declared.
 */
export function PageActions({ children }: PropsWithChildren) {
    const context = useContext(PageActionsContext);

    if (!context?.container) {
        return null;
    }

    return createPortal(children, context.container);
}
