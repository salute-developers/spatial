import { useCallback, useEffect } from 'react';
import { spatnavInstance, Config, SECTION_ROOT_CLASS_NAME } from '../../core';

export type CustomizeConfig = (config: Partial<Config>) => void;

export type UseSectionResultTuple<S extends string> = [
    { className: typeof SECTION_ROOT_CLASS_NAME; id: S | '' },
    CustomizeConfig,
];

/**
 * Создаёт секцию и набор инструментов для работы с ней.
 * Если изменить имя секции, передаваемое в хук, то будет создана новая секция с новым конфигом, а старая будет удалена.
 *
 * @param sectionId имя секции, если передано существующее — хук вернёт tuple с данными существующей секции
 *
 * @returns Объект с props для корневого элемента секции и функция для кастомизации параметров секции.
 * Колбек `customizeConfig` мемоизирован с помощью `useCallback` и зависит `sectionId`.
 *
 * @example
 * ```typescript
 * const Page1 = ({ condition }) => {
 *      const [section1Props, customizeSection1] = useSection('section1');
 *      const [section2Props, customizeSection2] = useSection(condition ? 'section2' : '');
 *
 *      useEffect(() => {
 *          customizeSection1({
 *              enterTo: 'default-element',
 *              straightOnly: true
 *          })
 *      }, [customizeSection1]);
 *
 *      useEffect(() => {
 *          customizeSection2({
 *              enterTo: 'default-element'
 *          })
 *      }, [customizeSection2]);
 *
 *      const onSelect = useCallback((event: KeyboardEvent) => {
 *          // ваша обработка
 *      }, []);
 *
 *      return (
 *          <>
 *              <div {...section1Props}> // или <div id={section1Props.id} className={section1Props.className}>
 *                 <FocusableButton onKeyDown={onSelect} />
 *                 <FocusableButton onKeyDown={onSelect} />
 *              </div>
 *              {condition && <div {...section2Props}> // или <div id={section2Props.id} className={section2Props.className}>
 *                 <FocusableButton onKeyDown={onSelect} />
 *                 <FocusableButton onKeyDown={onSelect} />
 *              </div>}
 *          </>
 *      );
 * };
 * ```
 */
export function useSection<S extends string>(sectionId: S): UseSectionResultTuple<S> {
    useEffect(() => {
        if (sectionId === '') {
            return;
        }

        spatnavInstance.add(sectionId);

        return () => {
            spatnavInstance.remove(sectionId);
        };
    }, [sectionId]);

    const customizeConfig = useCallback(
        (sectionConfig: Partial<Config>) => {
            if (sectionId === '') {
                return;
            }

            spatnavInstance.set(sectionId, sectionConfig);
        },
        [sectionId],
    );

    return [{ className: SECTION_ROOT_CLASS_NAME, id: sectionId }, customizeConfig];
}
