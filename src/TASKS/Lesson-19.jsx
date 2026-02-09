/* 
	https://ru.react.dev/learn/separating-events-from-effects
	Separating Events from Effects
	
	======AND======

*/
import { useState, useEffect, useEffectEvent } from 'react';

/* С помощью этого кода вы можете быть уверены, что всегда существует активное соединение с выбранным в данный момент сервером чата, независимо от конкретных взаимодействий, выполняемых пользователем. */
export function sendMessage(message, roomId) {
	console.log('🔵 You sent: ' + message + ' from ' + roomId);
}

export function createConnection(serverUrl, roomId) {
	// A real implementation would actually connect to the server
	return {
		connect() {
			console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
		},
		disconnect() {
			console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
		},
	};
}

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
	const [message, setMessage] = useState('');

	const onConnected = useEffectEvent(() => {
		console.log('Connected on ' + theme);
	});

	useEffect(() => {
		const connection = createConnection(serverUrl, roomId);
		connection.connect();

		onConnected();

		return () => connection.disconnect();
	}, [roomId]);

	function handleSendClick() {
		sendMessage(message, roomId);
	}

	return (
		<div>
			<h1>Welcome to the {roomId} room!</h1>
			<input value={message} onChange={(e) => setMessage(e.target.value)} />
			<button onClick={handleSendClick}>Send</button>
		</div>
	);
}

function App() {
	const [roomId, setRoomId] = useState('general');
	const [show, setShow] = useState(false);
	const [isDark, setIsDark] = useState(true);
	return (
		<div>
			<label>
				Choose the chat room:{' '}
				<select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
					<option value="general">general</option>
					<option value="travel">travel</option>
					<option value="music">music</option>
				</select>
			</label>
			<button onClick={() => setShow(!show)}>{show ? 'Close chat' : 'Open chat'}</button>
			{show && <br />}
			{show && <ChatRoom theme={isDark ? 'dark' : 'light'} key={roomId} roomId={roomId} />}
		</div>
	);
}

// ====================================================
/* 
Этот компонент Timer хранит переменную состояния count , которая увеличивается каждую секунду. Значение, на которое оно увеличивается, сохраняется в переменной состояния increment . Вы можете управлять переменной increment с помощью кнопок «плюс» и «минус».
Однако независимо от того, сколько раз вы нажимаете кнопку «плюс», счетчик все равно увеличивается на единицу каждую секунду. Что не так с этим кодом? Почему increment всегда равно 1 внутри кода эффекта? Найдите ошибку и исправьте ее.
*/

/* ЗАТЕМ
Существует небольшая проблема с этим пользовательским интерфейсом. Вы можете заметить, что если вы продолжаете нажимать кнопки «плюс» или «минус» чаще, чем раз в секунду, таймер сам по себе останавливается. Он возобновляется только через секунду с момента последнего нажатия любой кнопки. Выясните, почему это происходит, и устраните проблему, чтобы таймер работал каждую секунду без перерывов.
*/
function Timer() {
	const [count, setCount] = useState(0);
	const [increment, setIncrement] = useState(1);

	const onTick = useEffectEvent(() => {
		setCount((c) => c + increment);
	});

	useEffect(() => {
		const id = setInterval(() => {
			// setCount((c) => c + increment);
			onTick();
		}, 1000);
		return () => {
			clearInterval(id);
		};
		/* // eslint-disable-next-line react-hooks/exhaustive-deps */
		// }, [increment]);
		// Если используется useEffectEvent то вот так
	}, []);

	return (
		<>
			<h1>
				Counter: {count}
				<button onClick={() => setCount(0)}>Reset</button>
			</h1>
			<br />
			<p>
				Every second, increment by:
				<button
					disabled={increment === 0}
					onClick={() => {
						setIncrement((i) => i - 1);
					}}>
					–
				</button>
				<b>{increment}</b>
				<button
					onClick={() => {
						setIncrement((i) => i + 1);
					}}>
					+
				</button>
			</p>
		</>
	);
}

// ====================================================
/* В этом примере вы можете настроить интервал задержки. Он хранится в переменной состояния delay , которая обновляется двумя кнопками. Однако даже если вы нажмете кнопку «плюс 100 мс», пока delay не составит 1000 миллисекунд (то есть секунду), вы заметите, что таймер по-прежнему увеличивается очень быстро (каждые 100 мс). Как будто ваши изменения delay игнорируются. Найдите и исправьте ошибку. */

function Timer2() {
	const [count, setCount] = useState(0);
	const [increment, setIncrement] = useState(1);
	const [delay, setDelay] = useState(100000);

	const onTick = useEffectEvent(() => {
		setCount((c) => c + increment);
	});

	// const onMount = useEffectEvent(() => {
	// 	return setInterval(() => {
	// 		onTick();
	// 	}, delay);
	// });

	useEffect(() => {
		// const id = onMount();
		const id = setInterval(() => {
			onTick();
		}, delay);

		return () => {
			clearInterval(id);
		};
	}, [delay]);

	return (
		<>
			<h1>
				Counter: {count}
				<button onClick={() => setCount(0)}>Reset</button>
			</h1>
			<br />
			<p>
				Increment by:
				<button
					disabled={increment === 0}
					onClick={() => {
						setIncrement((i) => i - 1);
					}}>
					–
				</button>
				<b>{increment}</b>
				<button
					onClick={() => {
						setIncrement((i) => i + 1);
					}}>
					+
				</button>
			</p>
			<p>
				Increment delay:
				<button
					disabled={delay === 100}
					onClick={() => {
						setDelay((d) => d - 100);
					}}>
					–100 ms
				</button>
				<b>{delay} ms</b>
				<button
					onClick={() => {
						setDelay((d) => d + 100);
					}}>
					+100 ms
				</button>
			</p>
		</>
	);
}

// ====================================================
/* 
Когда вы присоединяетесь к чату, этот компонент отображает уведомление. Однако уведомление не отображается сразу. Вместо этого уведомление искусственно задерживается на две секунды, чтобы у пользователя была возможность осмотреться в пользовательском интерфейсе.
Это почти работает, но есть ошибка. Попробуйте очень быстро изменить раскрывающийся список с «Общие» на «Путешествия», а затем на «Музыка». Если вы сделаете это достаточно быстро, вы увидите два уведомления (как и ожидалось!), но в обоих будет написано «Добро пожаловать в музыку».
Исправьте это так, чтобы при очень быстром переключении с «общего» на «путешествие», а затем на «музыку», вы видели два уведомления: первое — «Добро пожаловать в путешествие», а второе — «Добро пожаловать в музыку». (Для дополнительной задачи, если вы уже настроили в уведомлениях правильные комнаты, измените код так, чтобы отображалось только последнее уведомление.)
*/
export function createConnection2(serverUrl, roomId) {
	// A real implementation would actually connect to the server
	let connectedCallback;
	let timeout;
	return {
		connect() {
			timeout = setTimeout(() => {
				if (connectedCallback) {
					connectedCallback();
				}
			}, 100);
		},
		on(event, callback) {
			if (connectedCallback) {
				throw Error('Cannot add the handler twice.');
			}
			if (event !== 'connected') {
				throw Error('Only "connected" event is supported.');
			}
			connectedCallback = callback;
		},
		disconnect() {
			clearTimeout(timeout);
		},
	};
}

const serverUrl2 = 'https://localhost:1234';

function ChatRoom2({ roomId, theme }) {
	// const onConnected = useEffectEvent(() => {
	// 	// showNotification();
	// 	console.log('Welcome to ' + roomId, theme);
	// });
	const onConnected = useEffectEvent((connectedRoomId) => {
		console.log('Welcome to ' + connectedRoomId, theme);
	});

	useEffect(() => {
		const connection = createConnection2(serverUrl2, roomId);

		let notificationTimeoutId;

		connection.on('connected', () => {
			notificationTimeoutId = setTimeout(() => {
				// onConnected();
				onConnected(roomId);

				// console.log('Welcome to ' + roomId, theme);
			}, 2000);
		});
		connection.connect();
		// return () => connection.disconnect();
		return () => {
			connection.disconnect();
			if (notificationTimeoutId !== undefined) {
				clearTimeout(notificationTimeoutId);
			}
		};
	}, [roomId]);

	return <h1>Welcome to the {roomId} room!</h1>;
}

function App2() {
	const [roomId, setRoomId] = useState('general');
	const [isDark, setIsDark] = useState(false);
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
			<label>
				<input
					type="checkbox"
					checked={isDark}
					onChange={(e) => setIsDark(e.target.checked)}
				/>
				Use dark theme
			</label>
			<br />
			<ChatRoom2 roomId={roomId} theme={isDark ? 'dark' : 'light'} />
		</>
	);
}

// ====================================================
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
			<App />
			<hr />
			<Timer />
			<hr />
			<Timer2 />
			<hr />
			<App2 />
			<hr />
		</>
	);
}

export default mainFunc;
