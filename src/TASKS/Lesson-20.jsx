/* 
	https://ru.react.dev/learn/reusing-logic-with-custom-hooks
	Reusing Logic with Custom Hooks
	
	======AND======

*/
import { useState, useEffect, useRef, useEffectEvent } from 'react';

/* Кастомный хук - useOnlineStatus*/
function useOnlineStatus() {
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		function handleOnline() {
			setIsOnline(true);
		}
		function handleOffline() {
			setIsOnline(false);
		}
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);
		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);
	return isOnline;
}

function StatusBar() {
	const isOnline = useOnlineStatus();
	return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
	const isOnline = useOnlineStatus();

	function handleSaveClick() {
		console.log('✅ Progress saved');
	}

	return (
		<button disabled={!isOnline} onClick={handleSaveClick}>
			{isOnline ? 'Save progress' : 'Reconnecting...'}
		</button>
	);
}

function App1() {
	return (
		<>
			<StatusBar />
			<SaveButton />
		</>
	);
}

// ====================================================
/* Если ваша функция не вызывает никаких хуков, избегайте префикса use . Вместо этого напишите ее как обычную функцию без префикса use . Например, приведенный ниже useSorted не вызывает хуки, поэтому вместо этого вызовите его getSorted : */
// 🔴 Avoid: A Hook that doesn't use Hooks
function useSorted(items) {
	return items.slice().sort();
}

// ✅ Good: A regular function that doesn't use Hooks
function getSorted(items) {
	return items.slice().sort();
}

// ====================================================

export function useFormInput(initialValue) {
	const [value, setValue] = useState(initialValue);

	function handleChange(e) {
		setValue(e.target.value);
	}

	const inputProps = {
		value: value,
		onChange: handleChange,
	};

	return inputProps;
}

function Form1() {
	const firstNameProps = useFormInput('Mary');
	const lastNameProps = useFormInput('Poppins');

	return (
		<>
			<label>
				First name:
				<input {...firstNameProps} />
			</label>
			<label>
				Last name:
				<input {...lastNameProps} />
			</label>
			<p>
				<b>
					Good morning, {firstNameProps.value} {lastNameProps.value}.
				</b>
			</p>
		</>
	);
}

// ====================================================

/* Passing reactive values between Hooks  */

// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================
function mainFunc() {
	return (
		<>
			<App1 />
			<hr />
			<Form1 />
			<hr />
		</>
	);
}

export default mainFunc;
