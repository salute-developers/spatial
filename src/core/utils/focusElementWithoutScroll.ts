const OPTIONS = { preventScroll: true };

export function focusElementWithoutScroll(element: HTMLElement): void {
    element.focus(OPTIONS);
}
