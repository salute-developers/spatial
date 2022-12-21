import { Section } from '../types';
import { focusElementWithoutScroll } from './focusElementWithoutScroll';
import { isFocusable } from './isFocusable';

export function focusSectionElement(section: Section, sectionId: string): boolean {
    const enterTo = section.config.enterTo;

    if (enterTo === 'last-focused' && section.lastFocusedElement) {
        focusElementWithoutScroll(section.lastFocusedElement);

        return true;
    }

    const defaultElement = section.config.getDefaultElement(section.rootElement, sectionId);

    if (enterTo === 'default-element' && defaultElement) {
        focusElementWithoutScroll(defaultElement);

        return true;
    }

    const sectionElements = section.sectionElements;

    for (const element of sectionElements) {
        if (isFocusable(element) === true) {
            focusElementWithoutScroll(element);

            return true;
        }
    }

    return false;
}
