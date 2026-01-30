/* 
	https://ru.react.dev/learn/queueing-a-series-of-state-updates
	Queueing a Series of State Updates
*/

import { useState } from 'react';
/* Вы работаете над приложением арт-маркетплейса, которое позволяет пользователю одновременно отправлять несколько заказов на арт-предмет. Каждый раз, когда пользователь нажимает кнопку «Купить», счётчик «Ожидания» должен увеличиваться на один. Через три секунды счётчик «Ожидание» должен уменьшиться, а счётчик «Завершено» — увеличиться.

Однако счётчик «Ожидается» ведёт себя не так, как задумано. При нажатии «Купить» он уменьшается до -1 (что не должно быть возможно!). А если нажать быстро дважды, оба счётчика ведут себя непредсказуемо. */
function RequestTracker() {
	const [pending, setPending] = useState(0);
	const [completed, setCompleted] = useState(0);

	async function handleClick() {
		setPending((p) => p + 1);
		await delay(3000);
		await setPending((p) => p - 1);
		// setPending(pending - 1);
		setCompleted((c) => c + 1);
	}

	return (
		<>
			<h3>Pending: {pending}</h3>
			<h3>Completed: {completed}</h3>
			<button onClick={handleClick}>Buy</button>
		</>
	);
}

function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

// ====================================================

function getFinalState(baseState, queue) {
	let finalState = baseState;

	// TODO: do something with the queue...
	for (const update of queue) {
		if (typeof update === 'function') {
			finalState = update(finalState);
		} else {
			finalState = update;
		}
	}

	return finalState;
}

function increment(n) {
	return n + 1;
}
increment.toString = () => 'n => n+1';

function TestCase({ baseState, queue, expected }) {
	const actual = getFinalState(baseState, queue);
	return (
		<>
			<p>
				Base state: <b>{baseState}</b>
			</p>
			<p>
				Queue: <b>[{queue.join(', ')}]</b>
			</p>
			<p>
				Expected result: <b>{expected}</b>
			</p>
			<p
				style={{
					color: actual === expected ? 'green' : 'red',
				}}>
				Your result: <b>{actual}</b> ({actual === expected ? 'correct' : 'wrong'})
			</p>
		</>
	);
}

function App() {
	return (
		<>
			<TestCase baseState={0} queue={[1, 1, 1]} expected={1} />
			<hr />
			<TestCase baseState={0} queue={[increment, increment, increment]} expected={3} />
			<hr />
			<TestCase baseState={0} queue={[5, increment]} expected={6} />
			<hr />
			<TestCase baseState={0} queue={[5, increment, 42]} expected={42} />
		</>
	);
}

// ====================================================
function MovingDot() {
	const [position, setPosition] = useState({
		x: 0,
		y: 0,
	});
	return (
		<div
			onPointerMove={(e) => {
				setPosition({
					x: e.clientX,
					y: e.clientY,
				});
			}}
			style={{
				position: 'relative',
				width: '100vw',
				height: '100vh',
				border: '1px solid red',
			}}>
			<div
				style={{
					position: 'fixed',
					backgroundColor: 'red',
					borderRadius: '50%',
					transform: `translate(${position.x}px, ${position.y}px)`,
					left: -10,
					top: -10,
					width: 20,
					height: 20,
				}}
			/>
		</div>
	);
}

// ====================================================
function Form() {
	const [person, setPerson] = useState({
		name: 'Niki de Saint Phalle',
		artwork: {
			title: 'Blue Nana',
			city: 'Hamburg',
			image: 'https://i.imgur.com/Sd1AgUOm.jpg',
		},
	});

	function handleNameChange(e) {
		setPerson({
			...person,
			name: e.target.value,
		});
	}

	function handleTitleChange(e) {
		setPerson({
			...person,
			artwork: {
				...person.artwork,
				title: e.target.value,
			},
		});
	}

	function handleCityChange(e) {
		setPerson({
			...person,
			artwork: {
				...person.artwork,
				city: e.target.value,
			},
		});
	}

	function handleImageChange(e) {
		setPerson({
			...person,
			artwork: {
				...person.artwork,
				image: e.target.value,
			},
		});
	}

	return (
		<>
			<label>
				Автор:
				<input value={person.name} onChange={handleNameChange} />
			</label>
			<label>
				Название:
				<input value={person.artwork.title} onChange={handleTitleChange} />
			</label>
			<label>
				Город:
				<input value={person.artwork.city} onChange={handleCityChange} />
			</label>
			<label>
				Изображение:
				<input value={person.artwork.image} onChange={handleImageChange} />
			</label>
			<p>
				<i>{person.artwork.title}</i>
				{' by '}
				{person.name}
				<br />
				(located in {person.artwork.city})
			</p>
			<img src={person.artwork.image} alt={person.artwork.title} />
		</>
	);
}

// ====================================================
import { useImmer } from 'use-immer';

function Form2() {
	const [person2, updatePerson] = useImmer({
		name: 'Niki de Saint Phalle',
		artwork: {
			title: 'Blue Nana',
			city: 'Hamburg',
			image: 'https://i.imgur.com/Sd1AgUOm.jpg',
		},
	});

	function handleNameChange(e) {
		updatePerson((draft) => {
			draft.name = e.target.value;
		});
	}

	function handleTitleChange(e) {
		updatePerson((draft) => {
			draft.artwork.title = e.target.value;
		});
	}

	function handleCityChange(e) {
		updatePerson((draft) => {
			draft.artwork.city = e.target.value;
		});
	}

	function handleImageChange(e) {
		updatePerson((draft) => {
			draft.artwork.image = e.target.value;
		});
	}

	return (
		<>
			<label>
				Автор:
				<input value={person2.name} onChange={handleNameChange} />
			</label>
			<label>
				Название:
				<input value={person2.artwork.title} onChange={handleTitleChange} />
			</label>
			<label>
				Город:
				<input value={person2.artwork.city} onChange={handleCityChange} />
			</label>
			<label>
				Изображение:
				<input value={person2.artwork.image} onChange={handleImageChange} />
			</label>
			<p>
				<i>{person2.artwork.title}</i>
				{' by '}
				{person2.name}
				<br />
				(located in {person2.artwork.city})
			</p>
			<img src={person2.artwork.image} alt={person2.artwork.title} />
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
function mainFunc() {
	return (
		<>
			<RequestTracker />
			<hr />
			<App />
			<hr />
			<MovingDot />
			<hr />
			<Form />
			<hr />
			<Form2 />
			<hr />
		</>
	);
}

export default mainFunc;
