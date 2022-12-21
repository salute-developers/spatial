export function getCurrentFocusedElement(): HTMLElement | null {
    const { activeElement } = document;

    if (activeElement !== null && activeElement !== document.body) {
        return activeElement as HTMLElement;
    }

    return null;
}
