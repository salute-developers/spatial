import { SECTION_ITEM_CLASS_NAME } from './constants';

export function isFocusable(element: HTMLElement): boolean {
    return element.classList.contains(SECTION_ITEM_CLASS_NAME) === true && element.hasAttribute('disabled') === false;
}
