import { createRoot } from 'react-dom/client';
import { Simple } from '../../../components/Simple';
import '../../../styles/common.css';

const app = document.getElementById('app');
ReactDOM.render(<Simple horizontal />, app);
