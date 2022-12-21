import { createRoot } from 'react-dom/client';
import { MultipleSection } from '../../../components/MultipleSection';
import '../../../styles/common.css';

const shift = {
    top: 32,
    position: 'absolute',
};

const s1Config = { straightOnly: true };

const App = () => {
    return (
        <MultipleSection
            s1Config={s1Config}
            s2Config={s1Config}
            s1Style={undefined}
            s2style={shift}
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
