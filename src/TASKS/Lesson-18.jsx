/* 
	https://ru.react.dev/learn/synchronizing-with-effects
	Эффекты для синхронизации

	======AND======

	https://ru.react.dev/learn/you-might-not-need-an-effect
	Возможно, вам не нужен Эффект

*/

import { useState, useRef, useEffect } from 'react';
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

// ====================================================
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
		</>
	);
}

export default mainFunc;
