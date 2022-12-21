import { Direction, SimpleSectionOptions } from '../types';

export function getNextSimpleSectionElement(
    direction: Direction,
    currentFocusedElement: HTMLElement,
    simpleSectionOptions: SimpleSectionOptions,
): HTMLElement | null {
    switch (direction) {
        case 'left':
            return simpleSectionOptions.type === 'row'
                ? (currentFocusedElement.previousElementSibling as HTMLElement | null)
                : null;
        case 'right':
            return simpleSectionOptions.type === 'row'
                ? (currentFocusedElement.nextElementSibling as HTMLElement | null)
                : null;
        case 'up':
            return simpleSectionOptions.type === 'column'
                ? (currentFocusedElement.previousElementSibling as HTMLElement | null)
                : null;
        case 'down':
            return simpleSectionOptions.type === 'column'
                ? (currentFocusedElement.nextElementSibling as HTMLElement | null)
                : null;
        default:
            return null;
    }
}
