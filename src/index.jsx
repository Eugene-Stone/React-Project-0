import { StrictMode } from 'react';
import { Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.scss';

// import App from './App-0';
// import App from './App-1';
// import App from './Gallery';
import App from './TASKS/Lesson-17';

const root = createRoot(document.getElementById('root'));
root.render(
	<StrictMode>
		<Fragment>
			<App />
		</Fragment>
	</StrictMode>,
);
