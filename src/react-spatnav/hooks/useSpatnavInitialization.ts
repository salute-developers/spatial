import { useEffect } from 'react';
import { InitializationOptions, spatnavInstance } from '../../';

/**
 * Инициализирует навигацию.
 *
 * Используется только один раз. Удобнее всего использовать в корневом компоненте.
 *
 * По умолчанию будет в фокусе первая добавленная секция
 *
 * @param options
 *
 * @param options.debug добавляет в `window` свойство `spatnavInstance` для отладки
 *
 * @param options.noObservers отключает IntersectionObserver и MutationObserver.
 * Расчёты ведутся по всем элементам, а не только по тем, что на экране.
 */
export function useSpatnavInitialization(
    { debug = false, noObservers = false }: InitializationOptions = { debug: false, noObservers: false },
): void {
    useEffect(
        function initSpatnav() {
            spatnavInstance.init({ debug, noObservers });

            return function unInitSpatnav() {
                spatnavInstance.unInit();
            };
        },
        [debug, noObservers],
    );
}
