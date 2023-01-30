import { createRoot } from 'react-dom/client';
import { Simple } from '../../../components/Simple';
import '../../../styles/common.css';

const app = document.getElementById('app');
const root = createRoot(app);
root.render(<Simple />);
