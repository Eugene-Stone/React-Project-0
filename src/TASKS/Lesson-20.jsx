/* 
	https://ru.react.dev/learn/reusing-logic-with-custom-hooks
	Reusing Logic with Custom Hooks
	
	======AND======

*/
import { useState, useEffect, useRef, useEffectEvent } from 'react';

/* 
	В идеале имя вашего пользовательского хука должно быть достаточно ясным, чтобы даже человек, который не часто пишет код, мог хорошо догадаться о том, что делает ваш пользовательский хук, что он принимает и что возвращает:

	✅ useData(url)
	✅ useImpressionLog(eventName, extraData)
	✅ useChatRoom(options)
*/

/* 
	При синхронизации с внешней системой ваше собственное имя перехватчика может быть более техническим и использовать жаргон, специфичный для этой системы. Хорошо, если человеку, знакомому с этой системой, будет понятно:

	✅ useMediaQuery(query)
	✅ useSocket(url)
	✅ useIntersectionObserver(ref, options)
*/

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

// ===========
/* Хук useOnlineStatus , переписанный с помощью нового API useSyncExternalStore: */
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
	window.addEventListener('online', callback);
	window.addEventListener('offline', callback);
	return () => {
		window.removeEventListener('online', callback);
		window.removeEventListener('offline', callback);
	};
}

export function useOnlineStatus2() {
	return useSyncExternalStore(
		subscribe,
		() => navigator.onLine, // How to get the value on the client
		() => true, // How to get the value on the server
	);
}

function StatusBar2() {
	const isOnline = useOnlineStatus2();
	return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton2() {
	const isOnline = useOnlineStatus2();

	function handleSaveClick() {
		console.log('✅ Progress saved');
	}

	return (
		<button disabled={!isOnline} onClick={handleSaveClick}>
			{isOnline ? 'Save progress' : 'Reconnecting...'}
		</button>
	);
}

function App3() {
	return (
		<>
			<SaveButton2 />
			<StatusBar2 />
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
/* Демонстрация передачи обработчика событий в пользовательский хук */
export function showNotification(message, theme = 'dark') {
	const themeCurrent = theme === 'dark' ? ' - black' : ' - white';
	console.log(message + themeCurrent);
}

export function createConnection({ serverUrl, roomId }) {
	// A real implementation would actually connect to the server
	if (typeof serverUrl !== 'string') {
		throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
	}
	if (typeof roomId !== 'string') {
		throw Error('Expected roomId to be a string. Received: ' + roomId);
	}
	let intervalId;
	let messageCallback;
	return {
		connect() {
			console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
			clearInterval(intervalId);
			intervalId = setInterval(() => {
				if (messageCallback) {
					if (Math.random() > 0.5) {
						messageCallback('hey');
					} else {
						messageCallback('lol');
					}
				}
			}, 3000);
		},
		disconnect() {
			clearInterval(intervalId);
			messageCallback = null;
			console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
		},
		on(event, callback) {
			if (messageCallback) {
				throw Error('Cannot add the handler twice.');
			}
			if (event !== 'message') {
				throw Error('Only "message" event is supported.');
			}
			messageCallback = callback;
		},
	};
}

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
	const onMessage = useEffectEvent(onReceiveMessage);

	useEffect(() => {
		const options = {
			serverUrl: serverUrl,
			roomId: roomId,
		};
		const connection = createConnection(options);
		connection.connect();
		connection.on('message', (msg) => {
			onMessage(msg);
		});
		return () => connection.disconnect();
	}, [roomId, serverUrl]);
}

function ChatRoom({ roomId }) {
	const [serverUrl, setServerUrl] = useState('https://localhost:1234');

	useChatRoom({
		roomId: roomId,
		serverUrl: serverUrl,
		onReceiveMessage(msg) {
			showNotification('New message: ' + msg);
		},
	});

	return (
		<>
			<label>
				Server URL:
				<input value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
			</label>
			<h1>Welcome to the {roomId} room!</h1>
		</>
	);
}

function App2() {
	const [roomId, setRoomId] = useState('general');
	return (
		<>
			<label>
				Choose the chat room:{' '}
				<select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
					<option value="general">general</option>
					<option value="travel">travel</option>
					<option value="music">music</option>
				</select>
			</label>
			<br />
			<ChatRoom roomId={roomId} />
		</>
	);
}

// ====================================================
/* 
Этот компонент использует переменную состояния и эффект для отображения числа, которое увеличивается каждую секунду. Извлеките эту логику в собственный хук под названием useCounter . Ваша цель — сделать так, чтобы реализация компонента Counter выглядела именно так:

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}

Вам нужно будет написать свой собственный хук в useCounter.js и импортировать его в файл App.js
*/

function useCounter() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setCount((c) => c + 1);
		}, 1000);
		return () => clearInterval(id);
	}, []);

	return count;
}

function Counter1() {
	const count = useCounter();
	// useEffect(() => {
	// 	const id = setInterval(() => {
	// 		setCount((c) => c + 1);
	// 	}, 1000);
	// 	return () => clearInterval(id);
	// }, []);
	return <h1>Seconds passed: {count}</h1>;
}

// ====================================================
/* 
В этом примере имеется переменная состояния delay , управляемая ползунком, но ее значение не используется. Передайте значение delay в свой пользовательский хук useCounter и измените хук useCounter чтобы использовать переданную delay вместо жесткого кодирования 1000 мс.
*/

export function useCounter2(delay) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setCount((c) => c + 1);
		}, delay);
		return () => clearInterval(id);
	}, [delay]);
	return count;
}

function Counter2() {
	const [delay, setDelay] = useState(1000);
	const count = useCounter2(delay);

	return (
		<>
			<label>
				Tick duration: {delay} ms
				<br />
				<input
					type="range"
					value={delay}
					min="10"
					max="2000"
					onChange={(e) => setDelay(Number(e.target.value))}
				/>
			</label>
			<br />
			<h1>Ticks: {count}</h1>
		</>
	);
}

// ====================================================
/* 
В настоящее время ваш useCounter Hook делает две вещи. Он устанавливает интервал, а также увеличивает переменную состояния на каждом такте интервала. Выделите логику, устанавливающую интервал, в отдельный хук под названием useInterval . Он должен принимать два аргумента: обратный вызов onTick и delay . После этого изменения ваша реализация useCounter должна выглядеть так:
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
*/

function useInterval(onTick, delay) {
	useEffect(() => {
		// Мой вариант не правильный,
		// const id = setInterval(() => {
		// 	onTick();
		// }, delay);

		// Вариант из учебника
		const id = setInterval(onTick, delay);
		return () => {
			clearInterval(id);
		};
	}, [delay]);
}

function useCounter3(delay) {
	const [count, setCount] = useState(0);
	// useEffect(() => {
	// 	const id = setInterval(() => {
	// 		setCount((c) => c + 1);
	// 	}, delay);
	// 	return () => clearInterval(id);
	// }, [delay]);

	useInterval(() => {
		setCount((c) => c + 1);
		// console.log(count);
	}, delay);

	return count;
}

function Counter3() {
	const count = useCounter3(1000);
	return <h1>Seconds passed: {count}</h1>;
}

// ====================================================
/* 
Компонент App вызывает useCounter , который вызывает useInterval для обновления счетчика каждую секунду. Но компонент App также вызывает useInterval для случайного обновления цвета фона страницы каждые две секунды.
По какой-то причине обратный вызов, обновляющий фон страницы, никогда не запускается. Добавьте несколько журналов внутри useInterval :
*/

export function useInterval4(onTick, delay) {
	const onTickInterval = useEffectEvent(onTick);

	useEffect(() => {
		// const id = setInterval(onTick, delay);
		const id = setInterval(onTickInterval, delay);

		return () => {
			clearInterval(id);
		};
		// }, [onTick, delay]);
	}, [delay]);
}

export function useCounter4(delay) {
	const [count, setCount] = useState(0);
	useInterval4(() => {
		setCount((c) => c + 1);
	}, delay);
	return count;
}

function Counter4() {
	const count = useCounter4(1000);

	useInterval4(() => {
		const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
		// document.body.style.backgroundColor = randomColor;
		document.body.style.backgroundColor = '#000';
	}, 2000);

	return <h1>Seconds passed: {count}</h1>;
}

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
			<App3 />
			<hr />
			<Form1 />
			<hr />
			<App2 />
			<hr />
			<Counter1 />
			<hr />
			<Counter2 />
			<hr />
			<Counter3 />
			<hr />
			<Counter4 />
			<hr />
		</>
	);
}

export default mainFunc;
