/* 
	https://ru.react.dev/learn/state-a-components-memory
	State: A Component's Memory
*/

import { useState } from 'react';

/* Когда вы вводите в поля ввода, ничего не появляется. Это как будто входные значения «застряли» пустыми строками. значение первого <input> настроен на то, чтобы всегда совпадать с firstName variable, и значение для второго <Input> установлен так, чтобы всегда совпадать с lastName variable. Это верно.Оба входа имеют onChange event handlers, которые пытаются обновить переменные на основе последнего пользовательского ввода (e.target.value). Однако переменные, похоже, не «запоминают» свои значения между повторными рендерами. Исправьте это, используя переменные в состоянии. */
function Form() {
	const [firstName, setName] = useState('');
	const [lastName, setLastName] = useState('');

	function handleFirstNameChange(e) {
		setName(e.target.value);
	}

	function handleLastNameChange(e) {
		setLastName(e.target.value);
	}

	function handleReset() {
		setName('');
		setLastName('');
	}

	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<input placeholder="First name" value={firstName} onChange={handleFirstNameChange} />
			<input placeholder="Last name" value={lastName} onChange={handleLastNameChange} />
			<h1>
				Hi, {firstName} {lastName}
			</h1>
			<button onClick={handleReset}>Reset</button>
		</form>
	);
}

// ====================================================
/* Вот небольшая форма, которая должна позволять пользователю оставить обратную связь. Когда обратная связь отправляется, она должна показывать благодарственное сообщение. Однако он вылетает с сообщением об ошибке «Отрисовано меньше хуков, чем ожидалось». Можете ли вы заметить ошибку и исправить её? */

function FeedbackForm() {
	const [isSent, setIsSent] = useState(false);
	const [message, setMessage] = useState('');

	if (isSent) {
		return <h1>Thank you!</h1>;
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				alert(`Sending: "${message}"`);
				setIsSent(true);
			}}>
			<textarea
				placeholder="Message"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<br />
			<button type="submit">Send</button>
		</form>
	);
}

// ====================================================
/* 
	При нажатии кнопки в этом примере следует запросить имя пользователя, а затем показать уведомление с его приветствием. Вы пытались использовать state, чтобы сохранить имя, но почему-то в первый раз появляется «Hello, !», а затем «Hello, [name]!» с предыдущим вводом каждый раз.
*/

function FeedbackForm2() {
	let name;

	function handleClick() {
		name = prompt('What is your name?');
		alert(`Hello, ${name}!`);
	}

	return <button onClick={handleClick}>Greet</button>;
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
			<Form />
			<hr />
			<FeedbackForm />
			<hr />
			<FeedbackForm2 />
			<hr />
		</>
	);
}

export default mainFunc;
