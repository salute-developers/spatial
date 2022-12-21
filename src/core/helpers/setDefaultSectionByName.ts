import { spatnavInstance } from './spatnavInstance';

/**
 * Устанавливает секцию по умолчанию с именем `sectionId`.
 * По умолчанию переводит фокус на эту секцию
 *
 * @param sectionId имя секции,
 *
 * @param needFocus нужно ли перевести фокус на на эту секцию
 *
 * @throws Выбросит исключение, если секции не существует
 */
export function setDefaultSectionByName(sectionId: string, needFocus = true): void {
    spatnavInstance.setDefaultSection(sectionId);

    if (needFocus) {
        spatnavInstance.focus(sectionId);
    }
}
