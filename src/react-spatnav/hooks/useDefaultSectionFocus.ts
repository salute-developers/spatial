import { useEffect } from 'react';
import { spatnavInstance } from '../../core';

/**
 * Устанавливает секцию по умолчанию и переводит фокус на её элемент,
 * в случае если фокус не находится ни на одном другом элементе любой другой секции
 *
 * @param sectionId пропсы для компонента секции или имя секции. Если не передан, то не выполняет никаких действий
 * 
 * @example 
 * ```jsx
 * import React from 'react';
 * import { useSection } from '@salutejs/spatial';
 * 
 * const Page = ({ children }) => {
 *     const [section1, customize1] = useSection('section1');
 *     const [section2, customize2] = useSection('section2');
 * 
 *     useEffect(() => {
 *         customize1({
 *             // `getDefaultElement` определён, но `enterTo` по умолчанию равен `calculated`,
 *             // поэтому колбек `getDefaultElement` будет игнорироваться
 *             getDefaultElement: (section1Root) => section1Root.lastElementChild,
 *         });
 * 
 *         customize2({
 *             // `getDefaultElement` определён и `enterTo` равен `default-element`,
 *             // при навигации внутрь этой секции фокус будет устанавливаться на элемент, который возвращает колбек `getDefaultElement`
 *             enterTo: 'default-element',
 *             getDefaultElement: (section2Root) => section2Root.lastElementChild,
 *         });
 *     }, [[customize1, customize2]]);
 * 
 *     // установка секции по умолчанию и установка фокуса на элемент из этой секции, выбранный по правилам определённым в её конфиге
 *     useDefaultSectionFocus('section2');
 * 
 *     return (
 *         <>
 *             <div {...section1}>
 *                 <div className="sn-section-item" tabIndex={-1}>
 *                     принадлежит секции section1
 *                 </div>
 *                 <div className="sn-section-item" tabIndex={-1}>
 *                     принадлежит секции section1
 *                 </div>
 *                 <div>
 *                     <div>
 *                         <div className="sn-section-item" tabIndex={-1}>
 *                             принадлежит секции section1
 *                         </div>
 *                     </div>
 *                 </div>
 *             </div>
 *             <div {...section2}>
 *                 <div className="sn-section-item" tabIndex={-1}>
 *                     принадлежит секции section2. После выполнения всех хуков, фокус будет установлен на этот элемент
 *                 </div>
 *                 <div className="sn-section-item" tabIndex={-1}>
 *                     принадлежит секции section2
 *                 </div>
 *             </div>
 *         </>
 *     );
 * };
```
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
