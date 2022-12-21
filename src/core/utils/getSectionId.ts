import { SECTION_ROOT_CLASS_NAME, SELF_SECTION_ID_ATTRIBUTE } from './constants';

const selector = `.${SECTION_ROOT_CLASS_NAME}`;

export function getSectionId(element: HTMLElement): string | null {
    const sectionElement = element.closest<HTMLElement>(selector);

    return (sectionElement && sectionElement.id) || element.getAttribute(SELF_SECTION_ID_ATTRIBUTE);
}
