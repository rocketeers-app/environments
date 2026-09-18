import { usePage } from '@inertiajs/react';
import type { ModalResponseData } from '@inertiaui/modal-react';
import { navPath } from '@/lib/nav-active';

/** The path every nav strip matches against: the page under an open modal, not the modal's url. */
export function useNavPath(): string {
    const page = usePage();
    const modal = (page.props as { _inertiaui_modal?: ModalResponseData })
        ._inertiaui_modal;

    return navPath(page.url, modal);
}
