import { createRoot } from 'react-dom/client';
import { MultipleSection } from '../../../../components/MultipleSection';
import '../../../../styles/common.css';

const s1Config = {
    leaveFor: {
        right() {
            if (typeof window.leaveForCallCounter === 'number') {
                window.leaveForCallCounter += 1;
            } else {
                window.leaveForCallCounter = 1;
            }
            return {
                type: 'no-spatnav-navigation',
                result: null,
            };
        },
        left() {
            return {
                type: 'section-name',
                result: 's2',
            };
        },
        up() {
            return {
                type: 'query-selector',
                result: '#s2 .sn-section-item:nth-child(2)',
            };
        },
        down() {
            return {
                type: 'element',
                result: document.querySelector('#s2 .sn-section-item:nth-child(2)'),
            };
        },
    },
};

const App = () => {
    return (
        <MultipleSection
            s1Config={s1Config}
            s2Config={undefined}
            s1Style={undefined}
            s2style={undefined}
            s1ClassName="inline"
            s2ClassName="inline"
            s1fStyle={undefined}
            s2fStyle={undefined}
            s1fClassName={undefined}
            s2fClassName={undefined}
            s1Length={5}
            s2Length={5}
        />
    );
};

const app = document.getElementById('app');
const root = createRoot(app);
root.render(<App />);
