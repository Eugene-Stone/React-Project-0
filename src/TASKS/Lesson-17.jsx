/* 
	https://ru.react.dev/learn/referencing-values-with-refs
	Обращаемся к значениям через рефы

	https://ru.react.dev/learn/manipulating-the-dom-with-refs
	Манипулирование DOM с помощью рефов
*/

/* 
	Самая простая формула:

	State = “что должно быть”
	Ref   = “сделай это сейчас”
*/

import { useState, useRef, use } from 'react';

function Stopwatch() {
	const [startTime, setStartTime] = useState(null);
	const [now, setNow] = useState(null);
	const intervalRef = useRef(null);

	function handleStart() {
		setStartTime(Date.now());
		setNow(Date.now());

		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			setNow(Date.now());
		}, 10);
	}

	function handleStop() {
		clearInterval(intervalRef.current);
	}

	let secondsPassed = 0;
	if (startTime != null && now != null) {
		secondsPassed = (now - startTime) / 1000;
	}

	return (
		<>
			<h1>Time passed: {secondsPassed.toFixed(3)}</h1>
			<button onClick={handleStart}>Start</button>
			<button onClick={handleStop}>Stop</button>
		</>
	);
}

// ====================================================
/* 
Исправьте неработающий input в чате 
Введите сообщение и нажмите «Send». Можно заметить трёхсекундную задержку перед тем, как появится модальное окно с сообщением «Sent!». Во время этой задержки появляется кнопка «Undo». Кликните по ней. Предполагается, что кнопка «Undo» предотвратит появление сообщения «Sent!». Это происходит из-за вызова clearTimeout для сохранения ID во время handleSend. Однако, даже после клика «Undo», сообщение все ещё появляется. Попробуйте разобраться, почему этот код не работает, и исправить его.
*/

function Chat() {
	const [text, setText] = useState('');
	const [isSending, setIsSending] = useState(false);
	let timeoutIDRef = useRef(null);

	function handleSend() {
		setIsSending(true);

		timeoutIDRef.current = setTimeout(() => {
			alert('Sent!');
			setIsSending(false);
		}, 3000);
	}

	function handleUndo() {
		setIsSending(false);
		clearTimeout(timeoutIDRef.current);
	}

	return (
		<>
			<input disabled={isSending} value={text} onChange={(e) => setText(e.target.value)} />
			<button disabled={isSending} onClick={handleSend}>
				{isSending ? 'Sending...' : 'Send'}
			</button>
			{isSending && <button onClick={handleUndo}>Undo</button>}
		</>
	);
}

// ====================================================
/* 
Исправьте ошибку при повторном рендере компонента 
Предполагается, что кнопка должна переключаться между отображением «On» и «Off». Но всегда отображается «Off». Что не так с эти кодом? Попробуйте исправить.
*/
function Toggle() {
	// const isOnRef = useRef(false);
	const [isOn, setIsOn] = useState(false);

	return (
		// <button
		// 	onClick={() => {
		// 		isOnRef.current = !isOnRef.current;
		// 	}}>
		// 	{isOnRef.current ? 'On' : 'Off'}
		// </button>

		<button
			onClick={() => {
				setIsOn(!isOn);
			}}>
			{isOn ? 'On' : 'Off'}
		</button>
	);
}

// ====================================================
/* 
В данном примере все обработчики событий для кнопок являются “debounced”. Чтобы понять, как это работает, кликните на одну из кнопок. Обратите внимание, что сообщение появляется через секунду. Если нажать на кнопку во время ожидания сообщения, таймер сбросится. Таким образом, если вы продолжите кликать одну и ту же кнопку много раз, сообщение не появится до тех пор, пока не пройдёт секунда после последнего клика. Debouncing позволяет вам установить задержку до тех пор, пока пользователь «не прекратит делать что-то», прежде чем произойдёт какое-то действие.

Этот пример работает, но не совсем как было задумано. Кнопки не являются независимыми. Чтобы увидеть проблему, кликните на одну из кнопок и затем кликните на другую кнопку. Мы ожидаем увидеть два сообщения, которые привязаны к каждой кнопке. Но мы увидим только сообщение последней. Сообщение первой кнопки потерялось.

Почему кнопки конфликтуют между собой? 
*/

// let timeoutID2;

// function DebouncedButton({ onClick, ref, children }) {
// function DebouncedButton({ ...props }) {
function DebouncedButton(props) {
	return (
		<button
			onClick={() => {
				clearTimeout(props.ref.current);

				props.ref.current = setTimeout(() => {
					props.onClick();
				}, 1000);
			}}>
			{props.children}
		</button>
	);
}

function Dashboard() {
	const timeoutID2Ref = useRef(null);

	return (
		<>
			<DebouncedButton ref={timeoutID2Ref} onClick={() => alert('Spaceship launched!')}>
				Launch the spaceship
			</DebouncedButton>
			<DebouncedButton ref={timeoutID2Ref} onClick={() => alert('Soup boiled!')}>
				Boil the soup
			</DebouncedButton>
			<DebouncedButton ref={timeoutID2Ref} onClick={() => alert('Lullaby sung!')}>
				Sing a lullaby
			</DebouncedButton>
		</>
	);
}

// ====================================================
/* 
В данном примере, после нажатия «Send» есть небольшая задержка прежде чем  появится сообщение. Введите «hello», нажмите Send и потом снова отредактируйте поле ввода. Несмотря на редактирование, модальное окно все ещё показывает «hello» (эта строка была значением состояния во время, когда произошёл клик по кнопке).

Как правило, именно такое поведение вам необходимо в вашем приложении. Тем не менее, могут возникнуть случаи, когда будет необходимость получить доступ к самой последней версии состояния в каком-либо асинхронном коде. Можете ли вы найти решение, чтобы модальное окно показывало текущий текст поля ввода вместо состояния, которое сохранилось во время клика?
*/
function Chat2() {
	const [text, setText] = useState('');

	const timerClearRef = useRef(null);

	function handleSend() {
		clearTimeout(timerClearRef.current);

		timerClearRef.current = setTimeout(() => {
			if (text) {
				alert('Sending: ' + text);
			}
		}, 3000);
	}

	return (
		<>
			<input value={text} onChange={(e) => setText(e.target.value)} />
			<button onClick={handleSend}>Send</button>
		</>
	);
}
/* 
Или так
Поскольку, в этом примере, введённый текст также используется для рендера, вам необходимо использовать и состояние переменной (для рендера), и реф (для чтения внутри таймера). 

function Chat2() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}

*/

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
			<Stopwatch />
			<hr />
			<Chat />
			<hr />
			<Toggle />
			<hr />
			<Dashboard />
			<hr />
			<Chat2 />
			<hr />
		</>
	);
}

export default mainFunc;
