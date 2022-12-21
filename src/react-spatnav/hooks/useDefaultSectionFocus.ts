import { useEffect } from 'react';
import { spatnavInstance } from '../../core';

/**
 * Устанавливает секцию по умолчанию и переводит фокус на неё, в случае если фокус не находится ни на одной из секций
 *
 * @param sectionId пропсы для компонента секции или имя секции. Если не передан, то не выполняет никаких действий
 */
export function useDefaultSectionFocus(sectionId?: string): void {
    useEffect(() => {
        if (sectionId === undefined) {
            return;
        }

        spatnavInstance.setDefaultSection(sectionId);

        if (document.activeElement === document.body) {
            spatnavInstance.focus(sectionId);
        }
    }, [sectionId]);
}
