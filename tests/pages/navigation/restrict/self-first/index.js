import { createRoot } from 'react-dom/client';
import { MultipleSection } from '../../../../components/MultipleSection';
import '../../../../styles/common.css';

const s1Config = {
    restrict: 'self-first',
};

const s2Config = {
    restrict: 'none',
};

const s2Style = { transform: 'translate(-121px, 20px)' };

const App = () => {
    return (
        <MultipleSection
            s1Config={s1Config}
            s2Config={s2Config}
            s1Style={undefined}
            s2style={s2Style}
            s1ClassName="inline"
            s2ClassName="inline"
            s1fStyle={undefined}
            s2fStyle={undefined}
            s1fClassName="sparse-vertical"
            s2fClassName="sparse-vertical"
            s1Length={2}
            s2Length={2}
        />
    );
};

const app = document.getElementById('app');
const root = createRoot(app);
root.render(<App />);
