# Spatial navigation для Canvas Apps

Пространственная навигация (Spatial navigation) — это возможность перемещаться между фокусируемыми элементами в зависимости от их положения в документе. Пространственная навигация часто называется «направленной навигацией», которая обеспечивает четырехнаправленную навигацию: сверху, слева, снизу, справа. Пользователи обычно знакомы с двусторонней навигацией с использованием «клавиш табуляции» для направления вперед, так и «клавиши Shift+Tab» для обратного направления.

[Есть спецификация для браузеров](https://drafts.csswg.org/css-nav-1/), которая пока в статусе "draft".

Мы рекомендуем использовать эту библиотеку для Canvas Apps на наших девайсах: TV, SberBox и др,
а [библиотеку](https://github.com/salute-developers/spatial-navigation) считать устаревшей.

Для мобильных устройств или других устройств с сенсорным экраном это не надо.

## Установка

```sh
npm install --save @salutejs/spatial
```

## Минимальная настройка приложения для работы с `@salutejs/spatial`

Нужно выполнить три обязательных шага.

### Инициализация в родительском компоненте всего приложения

```jsx
import React from 'react';
import { useSpatnavInitialization } from '@salutejs/spatial';

import { Page } from './pages/Page';

const App = () => {
    useSpatnavInitialization();

    return <Page />;
};
```

### Добавление секции

Для навигации `@salutejs/spatial` использует [секции](#подробнее-о-секциях). Секцию можно добавить с помощью хука `useSection`.

```jsx
import React from 'react';
import { useSection } from '@salutejs/spatial';

const Page = ({ children }) => {
    const [sectionProps] = useSection('sectionName');

    return <div {...sectionProps} />;
};

export default Page;
```

### Включение навигации на DOM элементе

Для того, чтобы браузер имел возможность фокусироваться на DOM элемент, этот элемент должен иметь атрибут tabindex="-1".

Далее для работы внутренних функций `@salutejs/spatial` необходимо добавить DOM элементу CSS класс "sn-section-item".

```jsx
<>
    <div className="sn-section-item" tabIndex={-1}>
        навигация работает
    </div>
    <div className="sn-section-item any-class my-class" tabIndex={-1}>
        навигация работает
    </div>
</>
```

Если убрать класс `sn-section-item`, то элемент исключается из навигации.

```jsx
<>
    <div className="sn-section-item" tabIndex={-1}>
        навигация работает
    </div>
    <div className="any-class my-class" tabIndex={-1}>
        навигация НЕ работает
    </div>
</>
```

Добавим элементы в секцию.

```jsx
import React from 'react';
import { useSection } from '@salutejs/spatial';

const Page = ({ children }) => {
    const [sectionProps] = useSection('sectionName');

    return (
        <div {...sectionProps}>
            <div className="sn-section-item" tabIndex={-1}>
                навигация работает
            </div>
            <div className="sn-section-item" tabIndex={-1}>
                навигация работает
            </div>
            <div>навигация НЕ работает</div>
        </div>
    );
};

export default Page;
```

Готово! Навигация настроена.

Здесь были рассмотрены только необходимые действия. Для упрощения кода и более гибкой настройки читайте далее.

## Углубление в `@salutejs/spatial`

### Варианты инициализации

Можно инициализировать `@salutejs/spatial` без использования хука `useSpatnavInitialization`, если такое требуется.

```js
import { spatnavInstance } from '@salutejs/spatial';

// вызывать только на клиенте
spatnavInstance.init();
```

Аналогично можно и отменить инициализацию. Например, при переходе на страницу, где пространственная навигация не нужна.

```js
spatnavInstance.unInit();
```

### Подробнее о секциях

Секция — это элементы навигации, объединённые в группу. У секции есть корневой элемент.
Включение секции в навигацию происходит с помощью хука `useSection`. У корневого элемента секции должны быть установлены аттрибуты `id="имя секции, переданное в useSection"` и `className="sn-section-root"`, которые возвращает хук `useSection`.
Элементы секции должны быть потомками корневого элемента и иметь аттрибут `className="sn-section-item"`.

```jsx
import React from 'react';
import { useSection } from '@salutejs/spatial';

const Page = ({ children }) => {
    const [section1] = useSection('section1');
    const [section2] = useSection('section2');

    return (
        <>
            <div {...section1}>
                <div className="sn-section-item" tabIndex={-1}>
                    принадлежит секции section1
                </div>
                <div className="sn-section-item" tabIndex={-1}>
                    принадлежит секции section1
                </div>
                <div>
                    <div>
                        <div className="sn-section-item" tabIndex={-1}>
                            принадлежит секции section1
                        </div>
                    </div>
                </div>
            </div>
            <div {...section2}>
                <div className="sn-section-item" tabIndex={-1}>
                    принадлежит секции section2
                </div>
                <div className="sn-section-item" tabIndex={-1}>
                    принадлежит секции section2
                </div>
            </div>
        </>
    );
};
```

#### Настройка параметров секции

Также хук `useSection` возвращает функцию кастомизации. С её помощью можно гибко настроить правила навигации внутри и между секциями. А также включить или выключить секцию целиком.

```jsx
import React from 'react';
import { useSection } from '@salutejs/spatial';

const Page = ({ children }) => {
    const [section1, customize1] = useSection('section1');
    const [section2, customize2] = useSection('section2');

    useEffect(() => {
        // выключаем навигацию в секции section1 целиком
        customize1({
            disabled: true,
        });

        customize2({
            simpleSectionOptions: { type: 'row' },
        });
    }, [[customize1, customize2]]);

    return (
        <>
            <div {...section1}>
                <div className="sn-section-item" tabIndex={-1}>
                    принадлежит секции section1, навигация выключена
                </div>
                <div className="sn-section-item" tabIndex={-1}>
                    принадлежит секции section1, навигация выключена
                </div>
                <div>
                    <div>
                        <div className="sn-section-item" tabIndex={-1}>
                            принадлежит секции section1, навигация выключена
                        </div>
                    </div>
                </div>
            </div>
            <div {...section2}>
                <div className="sn-section-item" tabIndex={-1}>
                    принадлежит секции section2
                </div>
                <div className="sn-section-item" tabIndex={-1}>
                    принадлежит секции section2
                </div>
            </div>
        </>
    );
};
```

О всех параметрах секции можно почитать в документации к типу `Config`. Параметры передаются в функцию `customize`.

## Оптимизация и ускорение работы

### Intersection и Mutation observer

Для ускорения расчётов в `@salutejs/spatial` используются Intersection и Mutation observer. Первый следит за тем какой элемент находится во вьюпорте браузера. `@salutejs/spatial` в первую очередь будет пытаться найти подходящий для навигации элемент именно среди видимых элементов.
Mutation observer нужен для того, чтобы при обновлении DOM дерева, новые элементы навигации были обработаны Intersection observer'ом.

### Простые секции

`@salutejs/spatial` делает довольно много расчётов, чтобы понять какой элемент больше подходит для навигации.
Но если в вашей вёрстке есть списки, в которых элементы всегда расположенны в ряд или столбик, то лучше включить режим простых секций. Этот режим переопределяет поведение навигации при выборе следующего или предыдущего элемента.
Вместо расчётов `@salutejs/spatial` просто возьмёт нужный элемент из DOM с помощью `nextSiblingElement` или `previousSiblingElement`.
Для того, чтобы этот режим работал необходимо передать соответствующую опцию в конфиг секции. И, обратите внимание, что все элементы секции должны быть на одном уровне в DOM.

В обоих примерах ниже режим простых секций будет работать.

```jsx
import React from 'react';
import { useSection } from '@salutejs/spatial';

const Page = ({ children }) => {
    const [section1, customize1] = useSection('section1');
    const [section2, customize2] = useSection('section2');

    useEffect(() => {
        customize1({
            simpleSectionOptions: { type: 'column' },
        });

        customize2({
            simpleSectionOptions: { type: 'row' },
        });
    }, [customize1, customize2]);

    return (
        <>
            <div {...section1}>
                <div>
                    <div>
                        <div className="sn-section-item" tabIndex={-1} />
                        <div className="sn-section-item" tabIndex={-1} />
                    </div>
                </div>
            </div>
            <div {...section2}>
                <div className="sn-section-item" tabIndex={-1} />
                <div className="sn-section-item" tabIndex={-1} />
            </div>
        </>
    );
};
```

# Запуск тестов

Для запуска тесов нужно собрать пакет spatial, запустить `test-app` и `cypress`.

```sh
npm run build

npm run test-app:start

npm run cypress:open
```

В открывшемся окне Cypress выбрать `E2E Testing`, тестировать можно как в Chrome так и в Electron.
