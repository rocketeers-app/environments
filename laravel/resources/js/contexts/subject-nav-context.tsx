import type { PropsWithChildren, ReactNode } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import type { NavGroup } from '@/types';

interface SubjectNavState {
    groups: NavGroup[];
    backHref?: string;
}

interface SubjectNavContextValue {
    subjectNav: SubjectNavState | null;
    subjectFooter: ReactNode | null;
    headerSlot: HTMLElement | null;
    setHeaderSlot: (element: HTMLElement | null) => void;
    setSubjectNav: (groups: NavGroup[], backHref?: string) => void;
    setSubjectFooter: (footer: ReactNode | null) => void;
    clearSubjectNav: () => void;
}

const SubjectNavContext = createContext<SubjectNavContextValue | null>(null);

export function SubjectNavProvider({ children }: PropsWithChildren) {
    const [subjectNav, setSubjectNavState] = useState<SubjectNavState | null>(
        null,
    );
    const [subjectFooter, setSubjectFooterState] = useState<ReactNode | null>(
        null,
    );

    const [headerSlot, setHeaderSlot] = useState<HTMLElement | null>(null);

    const setSubjectNav = useCallback(
        (groups: NavGroup[], backHref?: string) =>
            setSubjectNavState({ groups, backHref }),
        [],
    );
    const setSubjectFooter = useCallback(
        (footer: ReactNode | null) => setSubjectFooterState(footer),
        [],
    );
    const clearSubjectNav = useCallback(() => {
        setSubjectNavState(null);
        setSubjectFooterState(null);
    }, []);

    return (
        <SubjectNavContext.Provider
            value={{
                subjectNav,
                subjectFooter,
                headerSlot,
                setHeaderSlot,
                setSubjectNav,
                setSubjectFooter,
                clearSubjectNav,
            }}
        >
            {children}
        </SubjectNavContext.Provider>
    );
}

const noop = () => {};

export function useSubjectNav(): SubjectNavContextValue {
    return (
        useContext(SubjectNavContext) ?? {
            subjectNav: null,
            subjectFooter: null,
            headerSlot: null,
            setHeaderSlot: noop,
            setSubjectNav: noop,
            setSubjectFooter: noop,
            clearSubjectNav: noop,
        }
    );
}
