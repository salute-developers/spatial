import { createRoot } from 'react-dom/client';
import { MultipleSection } from '../../../../components/MultipleSection';
import '../../../../styles/common.css';

const s1Config = {
    simpleSectionOptions: {
        type: 'row',
    },
};

const App = () => {
    return (
        <MultipleSection
            s1Config={s1Config}
            s2Config={undefined}
            s1Style={undefined}
            s2style={undefined}
            s1ClassName={undefined}
            s2ClassName={undefined}
            s1fStyle={undefined}
            s2fStyle={undefined}
            s1fClassName="inline"
            s2fClassName="inline"
            s1Length={5}
            s2Length={5}
        />
    );
};

const app = document.getElementById('app');
const root = createRoot(app);
root.render(<App />);
