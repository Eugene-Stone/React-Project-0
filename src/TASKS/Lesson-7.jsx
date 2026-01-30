/* 
	https://ru.react.dev/learn/updating-objects-in-state
	Обновление объектов в состоянии
*/

import { useState } from 'react';

/* Форма имеет несколько ошибок. Нажмите кнопку, которая увеличивает счёт. Обратите внимание, он не увеличивается визуально. Затем отредактируйте имя и обратите внимание, что счёт внезапно “догнал” ваши изменения. Наконец, отредактируйте фамилию и обратите внимание, что счёт полностью исчез.

Необходимо исправить эти ошибки. Когда вы завершите исправления, объясните, почему происходили ошибки. */
export default function Scoreboard() {
	const [player, setPlayer] = useState({
		firstName: 'Ranjani',
		lastName: 'Shettar',
		score: 10,
	});

	function handlePlusClick() {
		// player.score++;
		setPlayer({
			...player,
			score: player.score + 1,
		});
	}

	function handleFirstNameChange(e) {
		setPlayer({
			...player,
			firstName: e.target.value,
		});
	}

	function handleLastNameChange(e) {
		setPlayer({
			...player,
			lastName: e.target.value,
		});
	}

	return (
		<>
			<label>
				Счёт: <b>{player.score}</b> <button onClick={handlePlusClick}>+1</button>
			</label>
			<label>
				Имя:
				<input value={player.firstName} onChange={handleFirstNameChange} />
			</label>
			<label>
				Фамилия:
				<input value={player.lastName} onChange={handleLastNameChange} />
			</label>
		</>
	);
}
