// Credit: https://usehooks-ts.com/
import { useCallback, useEffect, useRef, useState } from 'react';

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

type Clipboard = {
    copied: boolean;
    copiedText: CopiedValue;
    copy: CopyFn;
};

export function useClipboard(resetAfter = 2000): Clipboard {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);
    const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearResetTimer = useCallback(() => {
        if (resetTimer.current) {
            clearTimeout(resetTimer.current);
            resetTimer.current = null;
        }
    }, []);

    useEffect(() => clearResetTimer, [clearResetTimer]);

    const copy: CopyFn = useCallback(
        async (text) => {
            if (!navigator?.clipboard) {
                console.warn('Clipboard not supported');

                return false;
            }

            try {
                await navigator.clipboard.writeText(text);
                clearResetTimer();
                setCopiedText(text);

                if (resetAfter > 0) {
                    resetTimer.current = setTimeout(
                        () => setCopiedText(null),
                        resetAfter,
                    );
                }

                return true;
            } catch (error) {
                console.warn('Copy failed', error);
                clearResetTimer();
                setCopiedText(null);

                return false;
            }
        },
        [clearResetTimer, resetAfter],
    );

    return { copied: copiedText !== null, copiedText, copy };
}
