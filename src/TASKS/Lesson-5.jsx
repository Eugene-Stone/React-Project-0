/* 
	https://ru.react.dev/learn/state-as-a-snapshot
	Состояние как снимок
*/

import { useState } from 'react';

/* Вам необходимо добавить alert в обработчик кликов. Когда загорается зелёный свет и появляется текст “Можно идти”, должно быть оповещение “Дальше Стоп”. Когда свет красный и текст “Стоп”, должно быть оповещение “Дальше Можно идти”.

Имеет ли значение, помещаете ли вы alert до или после вызова setWalk? */
function TrafficLight() {
	const [walk, setWalk] = useState(true);

	function handleClick() {
		setWalk(!walk);
		if (!walk) {
			setTimeout(() => {
				alert('Дальше стоп');
			}, 1000);
		} else {
			setTimeout(() => {
				alert('Дальше Можно идти');
			}, 1000);
		}

		// Или так
		// alert(walk ? 'Дальше Стоп' : 'Дальше Можно идти');
	}

	return (
		<>
			<button onClick={handleClick}>Изменить на {walk ? 'Стоп' : 'Можно идти'}</button>
			<h1
				style={{
					color: walk ? 'darkgreen' : 'darkred',
				}}>
				{walk ? 'Можно идти' : 'Стоп'}
			</h1>
		</>
	);
}

// ====================================================

function Counter() {
	const [number, setNumber] = useState(0);
	const [themeDark, setThemeDark] = useState(false);

	let bodyDoc = document.querySelector('body');
	return (
		<>
			<h1>{number}</h1>
			<button
				onClick={() => {
					setNumber((n) => n + 3);
					// setNumber((n) => n + 4);
					// setNumber(number + 1);
					// setNumber(number + 1);
					// setNumber(number + 7);

					if (themeDark) {
						setThemeDark(false);

						bodyDoc.classList.add('dark');
						bodyDoc.classList.remove('light');
					} else {
						setThemeDark(true);

						bodyDoc.classList.add('light');
						bodyDoc.classList.remove('dark');
					}
				}}>
				+3
			</button>
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
			<TrafficLight />
			<hr />
			<Counter />
			<hr />
		</>
	);
}

export default mainFunc;
