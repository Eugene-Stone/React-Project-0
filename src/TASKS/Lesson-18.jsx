/* 
	https://ru.react.dev/learn/synchronizing-with-effects
	Эффекты для синхронизации

	======AND======

	https://ru.react.dev/learn/you-might-not-need-an-effect
	Возможно, вам не нужен Эффект

	======AND======

	https://ru.react.dev/learn/lifecycle-of-reactive-effects
	Lifecycle of Reactive Effects

*/

import { useState, useRef, useEffect, useMemo } from 'react';
function MyComponent() {
	useEffect(() => {
		// Код здесь будет выполняться после *каждого* рендера
	});
	return <div />;
}
/* 
	useEffect(() => {
	// Это выполняется после каждого рендеринга
	});

	useEffect(() => {
	// Это выполняется только при монтировании (когда компонент появляется)
	}, []);

	useEffect(() => {
	// Это выполняется при монтировании *и также*, если a или b изменились с последнего рендеринга
	}, [a, b]);
*/

// ====================================================

function VideoPlayer({ src, isPlaying, setIsPlaying }) {
	const ref = useRef(null);

	useEffect(() => {
		if (isPlaying) {
			// Он используется здесь...
			ref.current.play();
		} else {
			ref.current.pause();
		}
	}, [isPlaying]); // ...поэтому он должен быть объявлен здесь!

	return <video ref={ref} src={src} loop playsInline />;
}

function AppVideo() {
	const [isPlaying, setIsPlaying] = useState(false);
	return (
		<>
			<button onClick={() => setIsPlaying(!isPlaying)}>
				{isPlaying ? 'Пауза' : 'Воспроизведение'}
			</button>
			<VideoPlayer
				isPlaying={isPlaying}
				src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
			/>
		</>
	);
}

// ====================================================
function ChatRoom() {
	useEffect(() => {
		const connection = createConnection();
		connection.connect();
		return () => connection.disconnect();
	}, []);
	return <h1>Добро пожаловать в чат!</h1>;
}
function createConnection() {
	// Фактическая реализация в действительности будет подключаться к серверу
	return {
		connect() {
			console.log('✅ Подключение...');
		},
		disconnect() {
			console.log('❌ Отключено.');
		},
	};
}

/* 
	В этом примере используется setTimeout, чтобы запланировать вывод текста в консоль через три секунды после запуска Эффекта. Функция очистки отменяет ожидающий таймаут. Начните с нажатия на кнопку “Установить компонент”:
*/
function Playground() {
	const [text, setText] = useState('a');

	useEffect(() => {
		function onTimeout() {
			console.log('⏰ ' + text);
		}

		console.log(`🔵 Запланировать лог "${text}"`);
		const timeoutId = setTimeout(onTimeout, 3000);

		return () => {
			console.log(`🟡 Отменить лог "${text}"`);
			clearTimeout(timeoutId);
		};
	}, [text]);

	return (
		<>
			<label>
				Что вывести в консоль:{' '}
				<input value={text} onChange={(e) => setText(e.target.value)} />
			</label>
			<h1>Выведется - {text}</h1>
		</>
	);
}

function AppPlayground() {
	const [show, setShow] = useState(false);
	return (
		<>
			<button onClick={() => setShow(!show)}>
				{show ? 'Размонтировать' : 'Установить'} компонент
			</button>
			{show && <br />}
			{show && <Playground />}
		</>
	);
}

// ====================================================
/* Сфокусировать поле при монтировании
 */

function MyInput({ value, onChange }) {
	const ref = useRef(null);

	// TODO: Это не совсем работает. Исправьте это.
	// ref.current.focus()

	useEffect(() => {
		ref.current.focus();

		// return () => {
		// 	ref.current.blur();
		// };
	}, []);

	return <input ref={ref} value={value} onChange={onChange} />;
}

// ====================================================
/* 
Эта форма рендерит два компонента <MyInput />.

Нажмите “Показать форму” и обратите внимание, что второе поле автоматически получает фокус. Это происходит потому, что оба компонента <MyInput /> пытаются сфокусировать поле внутри. Когда вы вызываете focus() для двух полей ввода подряд, последнее всегда “выигрывает”.

Предположим, вы хотите сфокусировать первое поле. Первому компоненту MyInput теперь передаётся булевый проп shouldFocus, установленный в true. Измените логику так, чтобы focus() вызывался только в том случае, если проп shouldFocus, полученный компонентом MyInput, равен true.
*/
function MyInput2({ shouldFocus, value, onChange }) {
	const ref = useRef(null);

	// TODO: вызывайте focus() только если shouldFocus равно true.
	useEffect(() => {
		if (shouldFocus) {
			ref.current.focus();
		}
	}, [shouldFocus]);

	return <input ref={ref} value={value} onChange={onChange} />;
}

// ====================================================
/* 
Этот компонент Counter отображает счётчик, который должен увеличиваться каждую секунду. При монтировании он вызывает setInterval. Это приводит к тому, что onTick выполняется каждую секунду. Функция onTick увеличивает счётчик.

Однако вместо того, чтобы увеличиваться раз в секунду, он увеличивается дважды. Почему это происходит? Найдите причину ошибки и исправьте её.
*/

function Counter() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		function onTick() {
			setCount((c) => c + 1);
		}

		const intervalId = setInterval(onTick, 1000);
		return () => clearInterval(intervalId);
	}, []);

	return <h1>{count}</h1>;
}

// ====================================================
/* 
Этот компонент отображает биографию выбранного человека. Он загружает биографию, вызывая асинхронную функцию fetchBio(person) при монтировании и каждый раз, когда person изменяется. Эта асинхронная функция возвращает Promise, который в конечном итоге разрешается в строку. Когда получение данных завершено, она вызывает setBio, чтобы отобразить эту строку под выпадающим списком.

В этом коде есть ошибка. Начните с выбора “Alice”. Затем выберите “Bob”, а сразу после этого выберите “Taylor”. Если вы сделаете это достаточно быстро, вы заметите эту ошибку: “Taylor” выбран, но в параграфе ниже написано “Персонаж этой биографии — Bob”.

Почему это происходит? Исправьте ошибку внутри этого эффекта.
*/
function PageBio() {
	const [person, setPerson] = useState('Alice');
	const [bio, setBio] = useState(null);

	useEffect(() => {
		let ignore = false;
		setBio(null);
		fetchBio(person).then((result) => {
			if (!ignore) {
				setBio(result);
			}
		});
		return () => {
			ignore = true;
		};
	}, [person]);

	return (
		<>
			<select
				value={person}
				onChange={(e) => {
					setPerson(e.target.value);
				}}>
				<option value="Alice">Alice</option>
				<option value="Bob">Bob</option>
				<option value="Taylor">Taylor</option>
			</select>
			<hr />
			<p>
				<i>{bio ?? 'Загрузка...'}</i>
			</p>
		</>
	);
}

// ====================================================
/* 
	https://ru.react.dev/learn/you-might-not-need-an-effect
	Возможно, вам не нужен Эффект
*/

/* 
Отправка POST-запроса 
Представим, что компонент Form делает два типа POST-запросов. Он отправляет событие аналитики при монтировании. А когда вы заполняете форму и нажимаете кнопку «Отправить», он отправит POST-запрос на конечную точку /api/register:


*/

function Form() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	// ✅ Хорошо: Этот код должен сработать когда компонент отрендерится
	useEffect(() => {
		post('/analytics/event', { eventName: 'visit_form' });
	}, []);

	// 🔴 Излишне: специфическая логика ивента внутри Эффекта
	const [jsonToSubmit, setJsonToSubmit] = useState(null);
	useEffect(() => {
		if (jsonToSubmit !== null) {
			post('/api/register', jsonToSubmit);
		}
	}, [jsonToSubmit]);

	function handleSubmit(e) {
		e.preventDefault();
		setJsonToSubmit({ firstName, lastName });
	}
	// ...
}

/* Если некоторая логика должна выполняться один раз при загрузке приложения, а не один раз при монтировании компонента, добавьте переменную верхнего уровня для отслеживания того, была ли она уже выполнена: */
let didInit = false;

function App() {
	useEffect(() => {
		if (!didInit) {
			didInit = true;
			// ✅ Будут вызваны один раз при загрузке приложения
			loadDataFromLocalStorage();
			checkAuthToken();
		}
	}, []);
	// ...
}

/* 
Этот вариант с useRef лучше
*/
function App2() {
	const didInitRef = useRef(false);

	useEffect(() => {
		if (!didInitRef.current) {
			didInitRef.current = true;
			loadData();
		}
	}, []);
	// ...
}

/* в React есть специальный хук для подписки на внешнее хранилище, который предпочтительнее использовать. Удалите эффект и замените его вызовом useSyncExternalStore: */

function subscribe(callback) {
	window.addEventListener('online', callback);
	window.addEventListener('offline', callback);
	return () => {
		window.removeEventListener('online', callback);
		window.removeEventListener('offline', callback);
	};
}

function useOnlineStatus() {
	// ✅ Лучше: Подписка на внешнее хранилище данных с помощью встроенного хука
	return useSyncExternalStore(
		subscribe, // React не будет подписываться заново, пока передаётся та же функция
		() => navigator.onLine, // Как получить значение на клиенте
		() => true, // Как получить значение на сервере
	);
}

function ChatIndicator() {
	const isOnline = useOnlineStatus();
	// ...
}

/* Многие приложения используют эффекты для получения данных. Довольно распространено писать эффект для получения данных, подобный этому: */

function SearchResults({ query }) {
	const [results, setResults] = useState([]);
	const [page, setPage] = useState(1);

	useEffect(() => {
		// 🔴 Избегайте: Получение данных без сбрасывающей функции
		fetchResults(query, page).then((json) => {
			setResults(json);
		});
		/* Вот так правильно */
		/* 
			let ignore = false;
			fetchResults(query, page).then(json => {
					if (!ignore) {
							setResults(json);
					}
			});
			return () => {
					ignore = true;
			};
		*/
	}, [query, page]);

	function handleNextPageClick() {
		setPage(page + 1);
	}
	// ...
}

// ====================================================
/* Трансформация данных без использования эффектов 
Ниже, компонент TodoList отображает список задач. Когда установлен флажок “Show only active todos”, завершенные задачи не отображаются в списке. Независимо от того, какие задачи видимы, нижняя часть страницы отображает количество задач, которые еще не завершены.

Упростите этот компонент, удалив все ненужные состояния и эффекты. */

function TodoListStart() {
	const [todos, setTodos] = useState(initialTodos);
	const [showActive, setShowActive] = useState(false);
	const [activeTodos, setActiveTodos] = useState([]);
	const [visibleTodos, setVisibleTodos] = useState([]);
	const [footer, setFooter] = useState(null);

	useEffect(() => {
		setActiveTodos(todos.filter((todo) => !todo.completed));
	}, [todos]);

	useEffect(() => {
		setVisibleTodos(showActive ? activeTodos : todos);
	}, [showActive, todos, activeTodos]);

	useEffect(() => {
		setFooter(<footer>{activeTodos.length} todos left</footer>);
	}, [activeTodos]);

	return (
		<>
			<label>
				<input
					type="checkbox"
					checked={showActive}
					onChange={(e) => setShowActive(e.target.checked)}
				/>
				Show only active todos
			</label>
			<NewTodo onAdd={(newTodo) => setTodos([...todos, newTodo])} />
			<ul>
				{visibleTodos.map((todo) => (
					<li key={todo.id}>{todo.completed ? <s>{todo.text}</s> : todo.text}</li>
				))}
			</ul>
			{footer}
		</>
	);
}

// Исправленный
function TodoList() {
	const [todos, setTodos] = useState(initialTodos);
	const [showActive, setShowActive] = useState(false);

	const activeTodos = todos.filter((todo) => !todo.completed);
	const visibleTodos = showActive ? activeTodos : todos;

	// useEffect(() => {
	// 	setActiveTodos(todos.filter((todo) => !todo.completed));
	// }, [todos]);

	// useEffect(() => {
	// 	setVisibleTodos(showActive ? activeTodos : todos);
	// }, [showActive, todos, activeTodos]);

	// useEffect(() => {
	// 	setFooter(<footer>{activeTodos.length} todos left</footer>);
	// }, [activeTodos]);

	return (
		<>
			<label>
				<input
					type="checkbox"
					checked={showActive}
					onChange={(e) => setShowActive(e.target.checked)}
				/>
				Show only active todos
			</label>
			<NewTodo onAdd={(newTodo) => setTodos([...todos, newTodo])} />
			<ul>
				{visibleTodos.map((todo) => (
					<li key={todo.id}>{todo.completed ? <s>{todo.text}</s> : todo.text}</li>
				))}
			</ul>
			{activeTodos.length} todos left
		</>
	);
}

function NewTodo({ onAdd }) {
	const [text, setText] = useState('');

	function handleAddClick() {
		setText('');
		onAdd(createTodo(text));
	}

	return (
		<>
			<input value={text} onChange={(e) => setText(e.target.value)} />
			<button onClick={handleAddClick}>Add</button>
		</>
	);
}

let nextId = 0;

function createTodo(text, completed = false) {
	return {
		id: nextId++,
		text,
		completed,
	};
}

const initialTodos = [
	createTodo('Get apples', true),
	createTodo('Get oranges', true),
	createTodo('Get carrots'),
];

// ====================================================
/* Кэширование вычислений без использования Эффектов 
В этом примере фильтрация задач была вынесена в отдельную функцию под названием getVisibleTodos(). Внутри этой функции есть вызов console.log(), который помогает следить, когда он вызывается. Переключите “Show only active todos” и обратите внимание, что это вызывает повторное выполнение getVisibleTodos(). Это ожидаемо, потому что видимые задачи меняются при переключении того, какие из них отображать.

Ваша задача - удалить Эффект, который пересчитывает список visibleTodos в компоненте TodoList. Но вам нужно убедиться, что getVisibleTodos() не запускается повторно (и, следовательно, не выводит никаких логов) при вводе текста в поле ввода. */

function TodoList2() {
	const [todos, setTodos] = useState(initialTodos2);
	const [showActive, setShowActive] = useState(false);
	const [text, setText] = useState('');
	// const [visibleTodos, setVisibleTodos] = useState([]);

	// useEffect(() => {
	// 	setVisibleTodos(getVisibleTodos(todos, showActive));
	// }, [todos, showActive]);

	const visibleTodos = useMemo(() => getVisibleTodos(todos, showActive), [todos, showActive]);

	function handleAddClick() {
		setText('');
		setTodos([...todos, createTodo2(text)]);
	}

	return (
		<>
			<label>
				<input
					type="checkbox"
					checked={showActive}
					onChange={(e) => setShowActive(e.target.checked)}
				/>
				Show only active todos
			</label>
			<input value={text} onChange={(e) => setText(e.target.value)} />
			<button onClick={handleAddClick}>Add</button>
			<ul>
				{visibleTodos.map((todo) => (
					<li key={todo.id}>{todo.completed ? <s>{todo.text}</s> : todo.text}</li>
				))}
			</ul>
		</>
	);
}

let nextId2 = 0;
let calls = 0;

function getVisibleTodos(todos, showActive) {
	console.log(`getVisibleTodos() was called ${++calls} times`);
	const activeTodos = todos.filter((todo) => !todo.completed);
	const visibleTodos = showActive ? activeTodos : todos;
	return visibleTodos;
}

function createTodo2(text, completed = false) {
	return {
		id: nextId2++,
		text,
		completed,
	};
}

const initialTodos2 = [
	createTodo2('Get apples', true),
	createTodo2('Get oranges', true),
	createTodo2('Get carrots'),
];

// ====================================================
/* Сброс состояния без использования эффектов 
Компонент EditContact получает объект контакта с такой структурой { id, name, email } как проп savedContact. Попробуйте отредактировать поля для имени и адреса электронной почты. Как только вы нажмёте кнопку “Сохранить”, кнопка контакта над формой обновляется с измененным именем. Если нажать кнопку “Сброс”, все изменения в форме отменяются. Поиграйте с этим интерфейсом, чтобы разобраться в нем.

Когда вы выбираете контакт с помощью кнопок сверху, форма сбрасывается, чтобы отобразить данные выбранного контакта. Это делается с помощью эффекта внутри EditContact.js. Удалите этот эффект. Найдите другой способ сбросить форму, когда изменяется savedContact.id. */

function EditContact({ savedContact, onSave }) {
	const [name, setName] = useState(savedContact.name);
	const [email, setEmail] = useState(savedContact.email);

	// useEffect(() => {
	// 	setName(savedContact.name);
	// 	setEmail(savedContact.email);
	// }, [savedContact]);

	return (
		<section>
			<label>
				Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
			</label>
			<label>
				Email:{' '}
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
			</label>
			<button
				onClick={() => {
					const updatedData = {
						id: savedContact.id,
						name: name,
						email: email,
					};
					onSave(updatedData);
				}}>
				Save
			</button>
			<button
				onClick={() => {
					setName(savedContact.name);
					setEmail(savedContact.email);
				}}>
				Reset
			</button>
		</section>
	);
}

// ====================================================
/* Отправить форму без Эффекта 
Компонент Form позволяет отправить сообщение другу. Когда вы отправляете форму, переменная состояния showForm устанавливается в значение false. Это вызывает Эффект, который вызывает sendMessage(message), отправляя сообщение (вы можете увидеть его в консоли). После отправки сообщения вы видите диалоговое окно “Thank you” с кнопкой “Open chat”, которая позволяет вернуться к форме.

Пользователи приложения отправляют слишком много сообщений. Чтобы немного усложнить чат, вы решили сначала показать диалоговое окно “Thank you”, а не форму. Измените переменную состояния showForm, чтобы она инициализировалась значением false вместо true. Как только вы внесете это изменение, консоль покажет, что было отправлено пустое сообщение. В этой логике что-то не так!

В чем корень этой проблемы? И как его исправить? */

function Form2() {
	const [showForm, setShowForm] = useState(false);
	const [message, setMessage] = useState('');

	// useEffect(() => {
	// 	if (!showForm) {
	// 		sendMessage(message);
	// 	}
	// }, [showForm, message]);

	function handleSubmit(e) {
		e.preventDefault();
		setShowForm(false);

		sendMessage(message);
	}

	if (!showForm) {
		return (
			<>
				<h1>Thanks for using our services!</h1>
				<button
					onClick={() => {
						setMessage('');
						setShowForm(true);
					}}>
					Open chat
				</button>
			</>
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				placeholder="Message"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<button type="submit" disabled={message === ''}>
				Send
			</button>
		</form>
	);
}

function sendMessage(message) {
	console.log('Sending message: ' + message);
}

// ====================================================
/* Включив serverUrl в качестве зависимости, вы гарантируете повторную синхронизацию Эффекта после его изменения. */
function createConnection2(serverUrl, roomId) {
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

function ChatRoom2({ roomId }) {
	const [serverUrl, setServerUrl] = useState('https://localhost:1234');

	useEffect(() => {
		const connection = createConnection2(serverUrl, roomId);
		connection.connect();
		return () => connection.disconnect();
	}, [roomId, serverUrl]);

	return (
		<>
			<label>
				Server URL:{' '}
				<input value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
			</label>
			<h1>Welcome to the {roomId} room!</h1>
		</>
	);
}

function App3() {
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
			<ChatRoom2 roomId={roomId} />
		</>
	);
}

/* Если serverUrl и roomId не зависят от рендеринга и всегда имеют одинаковые значения, вы можете переместить их за пределы компонента. Теперь они не обязательно должны быть зависимостями: */
/* 
	const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
	const roomId = 'general'; // roomId is not reactive

	function ChatRoom() {
	useEffect(() => {
		const connection = createConnection(serverUrl, roomId);
		connection.connect();
		return () => {
		connection.disconnect();
		};
	}, []); // ✅ All dependencies declared
	// ...
	}
*/

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
			<AppVideo />
			<hr />
			<ChatRoom />
			<hr />
			<AppPlayground />
			<hr />
			<Counter />
			<hr />
			<TodoList />
			<hr />
			<TodoList2 />
			<hr />
			<Form2 />
			<hr />
			<App3 />
			<hr />
		</>
	);
}

export default mainFunc;
