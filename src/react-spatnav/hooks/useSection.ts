import { useEffect, useMemo } from 'react';
import { spatnavInstance, Config, SECTION_ROOT_CLASS_NAME, SECTION_DEFAULT_ITEM_CLASS_NAME } from '../../core';

export type CustomizeConfig = (config: Partial<Config>) => void;

export type UseSectionResultTuple<S extends string> = [
    { className: typeof SECTION_ROOT_CLASS_NAME; id: S },
    CustomizeConfig,
];

/**
 * Создаёт секцию и набор инструментов для работы с ней.
 *
 * @param sectionId имя секции, если передано существующее — хук вернёт tuple с данными существующей секции
 *
 * @returns объект с props для корневого элемента секции и функция для кастомизации параметров секции.
 *
 * Сам tuple и его содержимое мемоизированно с помощью useMemo и зависит только от `sectionId`.
 * Но если изменить имя секции, передаваемое в хук, то будет создана новая секция с новым конфигом, а старая будет удалена.
 *
 * @example
 * ```typescript
 * const Page1: FC = () => {
 *      const [sectionProps, customizeMySection] = useSection('mySection');
 *
 *      useEffect(() => {
 *          customizeMySection({
 *              enterTo: 'default-element',
 *              straightOnly: true
 *          })
 *      }, []);
 *
 *      const onSelect = useCallback((event: KeyboardEvent) => {
 *          // ваша обработка
 *      }, []);
 *
 *      return (
 *          <div {...sectionProps}> // или <div id={sectionProps.id} className={sectionProps.className}>
 *             <FocusableButton onKeyDown={onSelect} />
 *             <FocusableButton onKeyDown={onSelect} />
 *          </div>
 *      );
 * };
 * ```
 */
export function useSection<S extends string>(sectionId: S): UseSectionResultTuple<S> {
    useEffect(() => {
        spatnavInstance.add(sectionId, {
            getDefaultElement(root) {
                return root.getElementsByClassName(`${SECTION_DEFAULT_ITEM_CLASS_NAME}`).item(0) as HTMLElement | null;
            },
        });

        return () => {
            spatnavInstance.remove(sectionId);
        };
    }, [sectionId]);

    return useMemo<UseSectionResultTuple<S>>(() => {
        function customizeConfig(sectionConfig: Partial<Config>) {
            spatnavInstance.set(sectionId, sectionConfig);
        }

        return [{ className: SECTION_ROOT_CLASS_NAME, id: sectionId }, customizeConfig];
    }, [sectionId]);
}
