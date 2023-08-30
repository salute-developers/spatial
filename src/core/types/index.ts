export interface Center {
    x: number;
    y: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}

export interface Rect {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    element: HTMLElement;
    center: Center;
}

export type Partition = Rect[][];

interface DistanceFunction {
    (rect: Rect): number;
}

export interface DistanceFunctions {
    nearPlumbLineIsBetter: DistanceFunction;
    nearHorizonIsBetter: DistanceFunction;
    nearTargetLeftIsBetter: DistanceFunction;
    nearTargetTopIsBetter: DistanceFunction;
    topIsBetter: DistanceFunction;
    bottomIsBetter: DistanceFunction;
    leftIsBetter: DistanceFunction;
    rightIsBetter: DistanceFunction;
}

export interface Priority {
    group: Rect[];
    distance: DistanceFunction[];
}

export type EnterTo = 'calculated' | 'last-focused' | 'default-element';

export type NavigationKeyCodes = 'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown';

export type Restrict = 'none' | 'self-only' | 'self-first';

export type Direction = 'left' | 'right' | 'up' | 'down';

export type LeaveForDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Навигация на элемент найденному c помощью document.querySelector(result), где result — это валидный селектор.
 */
type LeaveForActionQueryString = {
    type: 'query-selector';
    result: string;
};

/**
 * Навигация в секцию.
 */
type LeaveForActionSectionId = {
    type: 'section-name';
    result: string;
};

/**
 * Навигация не происходит.
 */
type LeaveForActionNoNavigation = {
    type: 'no-spatnav-navigation';
    result: null;
};

/**
 * Навигация на элемент.
 */
type LeaveForActionElement = {
    type: 'element';
    result: HTMLElement;
};

/**
 * Обычное поведение spatnav.
 */
type LeaveForActionDefault = {
    type: 'fallback-to-spatnav';
    result: null;
};

/**
 * Коллбэк, срабатывающий при выходе из секции
 */
export interface LeaveForGetter {
    (
        rootElement: HTMLElement,
        sectionId: string,
    ):
        | LeaveForActionQueryString
        | LeaveForActionSectionId
        | LeaveForActionNoNavigation
        | LeaveForActionElement
        | LeaveForActionDefault;
}

type LeaveFor = Partial<Record<Direction, LeaveForGetter>>;

export type SimpleSectionOptions = {
    type: 'row' | 'column';
};

export type Config = {
    /**
     * Spatial Navigation будет искать только элементы, лежащие на одной линии (вертикально или горизонтально) с текущим активным элементом
     *
     * По умолчанию считается только элементы лежащие пиксель в пиксель на одной линии.
     *
     * Если `straightOnly` нажатия вниз элемент `next` будет пропущен и будет выбран `real next`
     *
     * @example
     * ```
     *      ┏━━━━━━━━━┓
     *      ┃ focused ┃
     *      ┗━━━━━━━━━┛
     *           ↓
     * ┏━━━━━━━┓ ↓
     * ┃ next? ┃ ↓
     * ┗━━━━━━━┛ ↓
     *           ↓
     *     ┏━━━━━━━━━━━┓
     *     ┃ real next ┃
     *     ┗━━━━━━━━━━━┛
     * ```
     */
    straightOnly: boolean;

    /**
     * Это свойство используется для определения того, что считать за элемент, находящийся на одной линии.
     * Допустимые значения от 0 до 1.0.
     * Значение 0.5 означает, что элемент считается стоящим на одной линии с текущим, только в том случае, если он перекрывает прямую область в направлении перехода не менее чем на половину.
     */
    straightOverlapThreshold: number;

    /**
     * Определяет можно ли выбрать элемент секции с помощью клавиш
     */
    disabled: boolean;

    /**
     * Функция, которая возвращает элемент по умолчанию для секции
     */
    getDefaultElement<S extends string>(sectionRoot: HTMLElement, sectionId: S): HTMLElement | null;

    /**
     * Определяет какой элемент выбрать при входе в секцию
     *
     * - `calculated` - Spatial Navigation сам выберет элемент для фокуса
     *
     * - `last-focused` - Последний элемент, который был в фокусе в данной секции, если такого нет - так же как `calculated`
     *
     * - `default-element` - Элемент, возвращаемый функцией getDefaultElement. Если результат getDefaultElement === null — то calculated
     */
    enterTo: EnterTo;

    /**
     * Переопределяет поведение Spatial Navigation при выходе из текущей секции.
     *
     * @example
     * ```typescript
     * section1.leaveFor = {
     *      up() {
     *          return {
     *              type: 'section-name',
     *              result: 'section0',
     *          }
     *      },
     *      left() {
     *          // произвольные действия
     *          window.history.pop()
     *
     *          return {
     *              type: 'no-spatnav-navigation',
     *              result: null,
     *          }
     *      },
     * }
     * ```
     */
    leaveFor: LeaveFor | null;

    /**
     * Определяет ограничения при перемещении внутри текущей секции.
     *
     * - `none` - никаких ограничений, Spatial Navigation сам выберет элемент для фокуса
     *
     * - `self-only` - ограничивает навигацию только в данной секции. Элементы из других групп можно будет выбрать только с помощью функции `elementFromDifferentGroup.focus()`
     *
     * - `self-first` - элементы внутри данной группы имеют более высокий приоритет, чем элементы из других групп
     */
    restrict: Restrict;
    /**
     * Определяет ограничения при перемещении внутри текущей секции.
     *
     * - `row` - если элементы секции расположены горизонтально
     *
     * - `column` - если элементы секции расположены вертикально

     */
    simpleSectionOptions: SimpleSectionOptions | null;
    /**
     * true если элемент имеет className sn-section-root и sn-section-item одновременно
     */
    selfSection: boolean;
};

export interface Section {
    /**
     * Конфиг текущей секции
     */
    config: Config;

    /**
     * Последний элемент, который был активным в этой секции
     */
    lastFocusedElement: HTMLElement | null;
    /**
     * HTML элемент секции
     */
    rootElement: HTMLElement;
    /**
     * Элементы секции
     */
    sectionElements: HTMLCollectionOf<HTMLElement> | Set<HTMLElement>;
}

export type InitializationOptions = {
    /**
     * Добавляет в `window` свойство `spatnavInstance` для отладки
     */
    debug: boolean;
    /**
     * Если параметр равен `true`, то выключает IntersectionObserver и MutationObserver.
     * Расчёты ведутся по всем элементам, а не только по тем, что на экране.
     */
    noObservers: boolean;
};
