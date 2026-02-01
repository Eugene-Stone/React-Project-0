/* 
	https://ru.react.dev/learn/referencing-values-with-refs
	Обращаемся к значениям через рефы
	======AND======
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
function Form() {
	const inputRef = useRef(null);

	function handleClick() {
		inputRef.current.focus();
	}

	return (
		<>
			<input ref={inputRef} />
			<button onClick={handleClick}>Focus the input</button>
		</>
	);
}

// ====================================================
/* 
В этом примере itemsRef не содержит ни одного узла DOM. Вместо этого он содержит карту от идентификатора элемента до узла DOM. (Ссылки могут содержать любые значения!) Обратный вызов ref для каждого элемента списка заботится об обновлении карты:
*/
function CatFriends() {
	const itemsRef = useRef(null);
	const [catList, setCatList] = useState(setupCatList);

	function scrollToCat(cat) {
		const map = getMap();
		const node = map.get(cat);
		node.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'center',
		});
	}

	function getMap() {
		if (!itemsRef.current) {
			// Initialize the Map on first usage.
			itemsRef.current = new Map();
		}
		return itemsRef.current;
	}

	return (
		<>
			<nav>
				<button onClick={() => scrollToCat(catList[0])}>Neo</button>
				<button onClick={() => scrollToCat(catList[2])}>Millie</button>
				<button onClick={() => scrollToCat(catList[4])}>Bella</button>
			</nav>
			<div className="gallery-overflow">
				<ul>
					{catList.map((cat) => (
						<li
							key={cat}
							ref={(node) => {
								const map = getMap();
								map.set(cat, node);

								return () => {
									map.delete(cat);
								};
							}}>
							<img src={cat} />
						</li>
					))}
				</ul>
			</div>
		</>
	);
}

function setupCatList() {
	const catList = [];
	for (let i = 0; i < 5; i++) {
		catList.push('https://loremflickr.com/320/240/cat?lock=' + i);
	}

	return catList;
}

// ====================================================

function MyInput({ ref }) {
	return <input ref={ref} />;
}

/*  В редких случаях вам может потребоваться ограничить предоставляемую функциональность. Вы можете сделать это с помощью useImperativeHandle */
import { useImperativeHandle } from 'react';

function MyInput2({ ref }) {
	const realInputRef = useRef(null);
	useImperativeHandle(ref, () => ({
		// Only expose focus and nothing else
		focus() {
			realInputRef.current.focus();
		},
	}));
	return <input ref={realInputRef} />;
}

function MyForm() {
	const inputRef = useRef(null);
	const inputRef2 = useRef(null);

	function handleClick() {
		inputRef.current.focus();
	}
	function handleClick2() {
		inputRef2.current.focus();
	}

	return (
		<>
			<MyInput ref={inputRef} />
			<MyInput2 ref={inputRef2} />
			<button onClick={handleClick}>Focus input 1</button>
			<button onClick={handleClick2}>Focus input 2</button>
		</>
	);
}

// ====================================================
import { flushSync } from 'react-dom';

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 10; i++) {
	initialTodos.push({
		id: nextId++,
		text: 'Todo #' + (i + 1),
	});
}

function TodoList() {
	const listRef = useRef(null);
	const [text, setText] = useState('');
	const [todos, setTodos] = useState(initialTodos);

	function handleAdd() {
		const newTodo = { id: nextId++, text: text };

		/* 
			Если сделать так, скролл идет к предполеднему пункту, так как рендер не успевает

			setText('');
			setTodos([ ...todos, newTodo]);
		*/

		/* Это укажет React синхронно обновить DOM сразу после выполнения кода, завернутого flushSync . В результате последняя задача уже будет в DOM к моменту, когда вы попытаетесь перейти к ней: */
		flushSync(() => {
			setText('');
			setTodos([...todos, newTodo]);
		});

		listRef.current.lastChild.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
		});
	}

	return (
		<>
			<button onClick={handleAdd}>Add</button>
			<input value={text} onChange={(e) => setText(e.target.value)} />
			<ul ref={listRef}>
				{todos.map((todo) => (
					<li key={todo.id}>{todo.text}</li>
				))}
			</ul>
		</>
	);
}

// ====================================================
/* 
Воспроизвести и поставить видео на паузу
В этом примере кнопка переключает переменную состояния для переключения между состоянием воспроизведения и состоянием паузы. Однако для того, чтобы воспроизвести или приостановить видео, переключения состояния недостаточно. Вам также необходимо вызвать play() и pause() в элементе DOM для <video> . Добавьте к нему ссылку и заставьте кнопку работать.

Чтобы усложнить задачу, синхронизируйте кнопку «Воспроизвести» с тем, воспроизводится ли видео, даже если пользователь щелкает видео правой кнопкой мыши и воспроизводит его с помощью встроенных элементов управления мультимедиа браузера. Для этого вы можете прослушать onPlay и onPause в видео.
*/
function VideoPlayer() {
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = useRef(null);

	function handleClick() {
		isPlaying ? videoRef.current.pause() : videoRef.current.play();

		const nextIsPlaying = !isPlaying;
		setIsPlaying(nextIsPlaying);
		// console.log(videoRef.current.onPlay());
	}

	return (
		<>
			<button onClick={handleClick}>{isPlaying ? 'Pause' : 'Play'}</button>
			<video
				ref={videoRef}
				width="250"
				onPlay={() => setIsPlaying(true)}
				onPause={() => setIsPlaying(false)}>
				<source
					src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
					type="video/mp4"
				/>
			</video>
		</>
	);
}

// ====================================================
/* Сделайте так, чтобы нажатие кнопки «Поиск» переводило фокус на поле. */
function PageSearch() {
	const searchInputRef = useRef(null);

	return (
		<>
			<nav>
				<button onClick={() => searchInputRef.current.focus()}>Search</button>
			</nav>
			<input ref={searchInputRef} placeholder="Looking for something?" />
		</>
	);
}

/* Сделайте так, чтобы нажатие кнопки «Поиск» переводило фокус на поле. Обратите внимание, что каждый компонент определен в отдельном файле и его не следует удалять из него. Как соединить их вместе? */
function PageSearch2() {
	const searchInputRef = useRef(null);

	return (
		<>
			<nav>
				<SearchButton searchInputRef={searchInputRef} />
			</nav>
			<SearchInput ref={searchInputRef} />
		</>
	);
}
function SearchButton({ searchInputRef }) {
	return <button onClick={() => searchInputRef.current.focus()}>Search</button>;
}
function SearchInput({ ref }) {
	return <input ref={ref} placeholder="Looking for something?" />;
}

// ====================================================
/* 
В этой карусели изображений есть кнопка «Далее», которая переключает активное изображение. Заставьте галерею прокручиваться по горизонтали до активного изображения при нажатии. Вам нужно будет вызвать scrollIntoView() в узле DOM активного изображения:
*/

const catList2 = [];
for (let i = 0; i < 10; i++) {
	catList2.push({
		id: i,
		imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i,
	});
}

function CatFriends2() {
	const [index, setIndex] = useState(0);
	const activeIndexRef = useRef(null);

	return (
		<>
			<nav>
				<button
					onClick={() => {
						/* flushSync необходим, чтобы заставить React обновить DOM перед прокруткой. В противном случае selectedRef.current всегда будет указывать на ранее выбранный элемент. */
						flushSync(() => {
							if (index < catList2.length - 1) {
								setIndex(index + 1);
							} else {
								setIndex(0);
							}
						});

						activeIndexRef.current.scrollIntoView({
							behavior: 'smooth',
							block: 'nearest',
							inline: 'center',
						});

						console.log(activeIndexRef.current);
					}}>
					Next
				</button>
			</nav>
			<div className="gallery-overflow">
				<ul>
					{catList2.map((cat, i) => (
						<li key={cat.id}>
							<img
								ref={index === i ? activeIndexRef : null}
								className={index === i ? 'active' : ''}
								src={cat.imageUrl}
								alt={'Cat #' + cat.id}
							/>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}

// ====================================================
/* 
Сосредоточьте поле поиска на отдельных компонентах
Сделайте так, чтобы нажатие кнопки «Поиск» переводило фокус на поле. Обратите внимание, что каждый компонент определен в отдельном файле и его не следует удалять из него. Как соединить их вместе?
*/
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

			<h1>Манипулирование DOM с помощью рефов</h1>
			<br />
			<Form />
			<hr />
			<CatFriends />
			<hr />
			<MyForm />
			<hr />
			<TodoList />
			<hr />
			<VideoPlayer />
			<hr />
			<PageSearch />
			<hr />
			<CatFriends2 />
			<hr />
			<PageSearch2 />
			<hr />
		</>
	);
}

export default mainFunc;
