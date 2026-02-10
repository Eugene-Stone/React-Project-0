/* 
	https://ru.react.dev/learn/separating-events-from-effects
	Separating Events from Effects
	
	======AND======

	https://ru.react.dev/learn/removing-effect-dependencies
	Removing Effect Dependencies
*/
import { useState, useEffect, useEffectEvent, useRef } from 'react';

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
		}, 100000);
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
/* 
	https://ru.react.dev/learn/removing-effect-dependencies
	Removing Effect Dependencies
*/

// Проблема с этим кодом в том, что вы синхронизируете две разные несвязанные вещи:
/* 
	function ShippingForm({ country }) {
	const [cities, setCities] = useState(null);
	const [city, setCity] = useState(null);
	const [areas, setAreas] = useState(null);

	useEffect(() => {
			let ignore = false;
			fetch(`/api/cities?country=${country}`)
					.then(response => response.json())
					.then(json => {
							if (!ignore) {
									setCities(json);
							}
					});
			// 🔴 Avoid: A single Effect synchronizes two independent processes
			if (city) {
					fetch(`/api/areas?city=${city}`)
							.then(response => response.json())
							.then(json => {
									if (!ignore) {
											setAreas(json);
									}
							});
			}
			return () => {
					ignore = true;
			};
	}, [country, city]); // ✅ All dependencies declared

	// ...
*/

// Разделите логику на два эффекта, каждый из которых реагирует на реквизит, с которым ему необходимо синхронизироваться:
/* 
	function ShippingForm({ country }) {
	const [cities, setCities] = useState(null);
	useEffect(() => {
			let ignore = false;
			fetch(`/api/cities?country=${country}`)
					.then(response => response.json())
					.then(json => {
							if (!ignore) {
									setCities(json);
							}
					});
			return () => {
					ignore = true;
			};
	}, [country]); // ✅ All dependencies declared

	const [city, setCity] = useState(null);
	const [areas, setAreas] = useState(null);
	useEffect(() => {
			if (city) {
					let ignore = false;
					fetch(`/api/areas?city=${city}`)
							.then(response => response.json())
							.then(json => {
									if (!ignore) {
											setAreas(json);
									}
							});
					return () => {
							ignore = true;
					};
			}
	}, [city]); // ✅ All dependencies declared

	// ...
*/

// События эффектов не являются реактивными, поэтому вам не нужно указывать их как зависимости.
/* 
	function ChatRoom({ roomId, onReceiveMessage }) {
	const [messages, setMessages] = useState([]);

	const onMessage = useEffectEvent(receivedMessage => {
			onReceiveMessage(receivedMessage);
	});

	useEffect(() => {
			const connection = createConnection();
			connection.connect();
			connection.on('message', (receivedMessage) => {
					onMessage(receivedMessage);
			});
			return () => connection.disconnect();
	}, [roomId]); // ✅ All dependencies declared
	// ...
*/

// ====================================================
/* Этот эффект устанавливает интервал, который тикает каждую секунду. Вы заметили что-то странное: кажется, что интервал уничтожается и создается заново каждый раз, когда он тикает. Исправьте код, чтобы интервал не создавался постоянно. */
function Timer3() {
	const [count, setCount] = useState(0);

	const setCountEvent = useEffectEvent(() => {
		setCount(count + 1);
	});
	useEffect(() => {
		console.log('✅ Creating an interval');
		const id = setInterval(() => {
			console.log('⏰ Interval tick');
			// setCount(count + 1);
			setCountEvent();
			/* Или так */
			// setCount((c) => c + 1);
		}, 100000);
		return () => {
			console.log('❌ Clearing an interval');
			clearInterval(id);
		};
	}, []);

	return <h1>Counter: {count}</h1>;
}

// ====================================================
/* 
В этом примере, когда вы нажимаете «Показать», появляется приветственное сообщение. Анимация длится секунду. При нажатии «Удалить» приветственное сообщение сразу исчезает. Логика плавного появления анимации реализована в файле animation.js в виде простого цикла анимации JavaScript. Вам не нужно менять эту логику. Вы можете относиться к ней как к сторонней библиотеке.Ваш эффект создает экземпляр FadeInAnimation для узла DOM, а затем вызывает start(duration) или stop() для управления анимацией.duration регулируется ползунком. Отрегулируйте ползунок и посмотрите, как изменится анимация.
Этот код уже работает, но вы хотите кое-что изменить. В настоящее время при перемещении ползунка, управляющего переменной состояния duration , анимация перезапускается. Измените поведение так, чтобы Эффект не «реагировал» на переменную duration . Когда вы нажимаете «Показать», эффект должен использовать текущую duration на ползунке. Однако само по себе перемещение ползунка не должно перезапускать анимацию.
*/
export class FadeInAnimation {
	constructor(node) {
		this.node = node;
	}
	start(duration) {
		this.duration = duration;
		if (this.duration === 0) {
			// Jump to end immediately
			this.onProgress(1);
		} else {
			this.onProgress(0);
			// Start animating
			this.startTime = performance.now();
			this.frameId = requestAnimationFrame(() => this.onFrame());
		}
	}
	onFrame() {
		const timePassed = performance.now() - this.startTime;
		const progress = Math.min(timePassed / this.duration, 1);
		this.onProgress(progress);
		if (progress < 1) {
			// We still have more frames to paint
			this.frameId = requestAnimationFrame(() => this.onFrame());
		}
	}
	onProgress(progress) {
		this.node.style.opacity = progress;
	}
	stop() {
		cancelAnimationFrame(this.frameId);
		this.startTime = null;
		this.frameId = null;
		this.duration = 0;
	}
}

function Welcome({ duration }) {
	const ref = useRef(null);
	const durationAnim = duration;

	// Или так
	const onAppear = useEffectEvent((animation) => {
		animation.start(duration);
	});
	useEffect(() => {
		const animation = new FadeInAnimation(ref.current);

		// animation.start(duration);
		animation.start(durationAnim);

		// // Или так
		// onAppear(animation);

		return () => {
			animation.stop();
		};
		// }, [duration]);
	}, []);

	return (
		<h1
			ref={ref}
			style={{
				opacity: 0,
				color: 'white',
				padding: 50,
				textAlign: 'center',
				fontSize: 50,
				backgroundImage:
					'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)',
			}}>
			Welcome
		</h1>
	);
}

function AppAnimation() {
	const [duration, setDuration] = useState(1000);
	const [show, setShow] = useState(false);

	return (
		<>
			<label>
				<input
					type="range"
					min="100"
					max="10000"
					value={duration}
					onChange={(e) => setDuration(Number(e.target.value))}
				/>
				<br />
				Fade in duration: {duration} ms
			</label>
			<button onClick={() => setShow(!show)}>{show ? 'Remove' : 'Show'}</button>
			<br />
			<div style={{ height: 160 }}>{show && <Welcome duration={duration} />}</div>
		</>
	);
}

// ====================================================
/* 
В этом примере каждый раз, когда вы нажимаете «Переключить тему», чат повторно подключается. Почему это происходит? Исправьте ошибку, чтобы чат повторно подключался только тогда, когда вы редактируете URL-адрес сервера или выбираете другую комнату чата.
Относитесь к chat.js как к внешней сторонней библиотеке: вы можете обратиться к ней, чтобы проверить ее API, но не редактируйте ее.

Если вы будете придерживаться примитивных свойств, где это возможно, это облегчит последующую оптимизацию ваших компонентов.
*/
export function createConnection3({ serverUrl, roomId }) {
	// A real implementation would actually connect to the server
	if (typeof serverUrl !== 'string') {
		throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
	}
	if (typeof roomId !== 'string') {
		throw Error('Expected roomId to be a string. Received: ' + roomId);
	}
	return {
		connect() {
			console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
		},
		disconnect() {
			console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
		},
	};
}

function ChatRoom3({ options }) {
	const { serverUrl, roomId } = options;

	useEffect(() => {
		// const connection = createConnection3(options);
		const connection = createConnection3({
			serverUrl: serverUrl,
			roomId: roomId,
		});
		connection.connect();
		return () => connection.disconnect();
		// }, [options]);
	}, [serverUrl, roomId]);

	return <h1>Welcome to the {options.roomId} room!</h1>;
}

function App3() {
	const [isDark, setIsDark] = useState(false);
	const [roomId, setRoomId] = useState('general');
	const [serverUrl, setServerUrl] = useState('https://localhost:1234');

	const options = {
		serverUrl: serverUrl,
		roomId: roomId,
	};

	return (
		<div className={isDark ? 'dark' : 'light'}>
			<button onClick={() => setIsDark(!isDark)}>Toggle theme</button>
			<label>
				Server URL:{' '}
				<input value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
			</label>
			<label>
				Choose the chat room:{' '}
				<select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
					<option value="general">general</option>
					<option value="travel">travel</option>
					<option value="music">music</option>
				</select>
			</label>
			<br />
			<ChatRoom3 options={options} />
		</div>
	);
}

// ====================================================
/* 
В этом примере подключение к чату осуществляется либо с шифрованием, либо без него. Установите флажок и обратите внимание на разные сообщения в консоли, когда шифрование включено и выключено. Попробуйте сменить комнату. Затем попробуйте переключить тему. Когда вы подключены к чату, вы будете получать новые сообщения каждые несколько секунд. Убедитесь, что их цвет соответствует выбранной вами теме.

В этом примере чат повторно подключается каждый раз, когда вы пытаетесь сменить тему. Исправьте это. После исправления изменение темы не должно повторно подключать чат, но переключение настроек шифрования или изменение комнаты должно повторно подключиться.

Не меняйте код в chat.js Помимо этого, вы можете изменить любой код, если это приведет к тому же поведению. Например, вам может оказаться полезным изменить передаваемые реквизиты.
*/

export function showNotification(message, theme) {
	const themeNotification = theme === 'dark' ? ' - Black' : ' - White';
	console.log(message + themeNotification + ' theme');
}
export function createEncryptedConnection({ serverUrl, roomId }) {
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
			console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
			console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
			console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
			console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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

function ChatRoom4({ roomId, isEncrypted, onMessage }) {
	//
	const onNotificationMessage = useEffectEvent((connection) => {
		connection.on('message', (msg) => onMessage(msg));
	});

	// Или так из учебника
	// const onReceiveMessage = useEffectEvent(onMessage);

	useEffect(() => {
		function createConnection4() {
			const options = {
				serverUrl: 'https://localhost:1234',
				roomId: roomId,
			};
			if (isEncrypted) {
				return createEncryptedConnection(options);
			} else {
				return createUnencryptedConnection(options);
			}
		}

		const connection = createConnection4();
		// connection.on('message', (msg) => onMessage(msg));
		onNotificationMessage(connection);

		// Из учебника
		// connection.on('message', (msg) => onReceiveMessage(msg));

		connection.connect();
		return () => connection.disconnect();
		// }, [createConnection4, onMessage]);
	}, [roomId, isEncrypted]);

	return <h1>Welcome to the {roomId} room!</h1>;
}

function App4() {
	const [isDark, setIsDark] = useState(false);
	const [roomId, setRoomId] = useState('general');
	const [isEncrypted, setIsEncrypted] = useState(false);

	return (
		<>
			<label>
				<input
					type="checkbox"
					checked={isDark}
					onChange={(e) => setIsDark(e.target.checked)}
				/>
				Use dark theme
			</label>
			<label>
				<input
					type="checkbox"
					checked={isEncrypted}
					onChange={(e) => setIsEncrypted(e.target.checked)}
				/>
				Enable encryption
			</label>
			<label>
				Choose the chat room:{' '}
				<select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
					<option value="general">general</option>
					<option value="travel">travel</option>
					<option value="music">music</option>
				</select>
			</label>
			<br />
			<ChatRoom4
				roomId={roomId}
				// serverUrl={'https://localhost:1234'}
				isEncrypted={isEncrypted}
				onMessage={(msg) => {
					showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
				}}
				// createConnection4={() => {
				// 	const options = {
				// 		serverUrl: 'https://localhost:1234',
				// 		roomId: roomId,
				// 	};
				// 	if (isEncrypted) {
				// 		return createEncryptedConnection(options);
				// 	} else {
				// 		return createUnencryptedConnection(options);
				// 	}
				// }}
			/>
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
			<Timer3 />
			<hr />
			<AppAnimation />
			<hr />
			<App3 />
			<hr />
			<App4 />
			<hr />
		</>
	);
}

export default mainFunc;
