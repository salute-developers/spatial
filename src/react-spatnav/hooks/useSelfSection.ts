import { useEffect, useMemo } from 'react';
import {
    spatnavInstance,
    Config,
    SECTION_ROOT_CLASS_NAME,
    SECTION_ITEM_CLASS_NAME,
    SELF_SECTION_ID_ATTRIBUTE,
} from '../../core';
import { CustomizeConfig } from './useSection';

export type UseSelfSectionResultTuple<S extends string> = [
    {
        className: `${typeof SECTION_ROOT_CLASS_NAME} ${typeof SECTION_ITEM_CLASS_NAME}`;
        [SELF_SECTION_ID_ATTRIBUTE]: S;
        id: S;
    },
    CustomizeConfig,
];

/**
 * Создаёт секцию, в которой корневой является единственным элементом секции, и набор инструментов для работы с ней.
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
 *          <div {...sectionProps} onKeyDown={onSelect}> // или <div id={sectionProps.id} className={sectionProps.className} onKeyDown={onSelect}>
 *              Title
 *          </div>
 *      );
 * };
 * ```
 */
export function useSelfSection<S extends string>(sectionId: S): UseSelfSectionResultTuple<S> {
    useEffect(() => {
        spatnavInstance.add(sectionId, {
            enterTo: 'default-element',
            restrict: 'none',
            getDefaultElement(root) {
                return root;
            },
        });

        return () => {
            spatnavInstance.remove(sectionId);
        };
    }, [sectionId]);

    return useMemo<UseSelfSectionResultTuple<S>>(() => {
        function customizeConfig(sectionConfig: Partial<Config>) {
            spatnavInstance.set(sectionId, sectionConfig);
        }

        return [
            {
                className: `${SECTION_ROOT_CLASS_NAME} ${SECTION_ITEM_CLASS_NAME}`,
                [SELF_SECTION_ID_ATTRIBUTE]: sectionId,
                id: sectionId,
            },
            customizeConfig,
        ];
    }, [sectionId]);
}
