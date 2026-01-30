/* 
	https://ru.react.dev/learn/extracting-state-logic-into-a-reducer

	Extracting State Logic into a Reducer
*/

/* Функция редуктора — это место, куда вы помещаете свою логику состояния. Он принимает два аргумента: текущее состояние и объект действия и возвращает следующее состояние:
 */
import { useReducer, useState } from 'react';

function handleAddTask(text) {
	dispatch({
		type: 'added',
		id: nextId++,
		text: text,
	});
}
function yourReducer(state, actionObject) {
	// return next state for React to set
}

function testFunc() {
	// Обычный способ =======
	const [tasks, setTasks] = useState(initialTasks);

	function handleAddTask(text) {
		setTasks([
			...tasks,
			{
				id: nextId++,
				text: text,
				done: false,
			},
		]);
	}

	function handleChangeTask(task) {
		setTasks(
			tasks.map((t) => {
				if (t.id === task.id) {
					return task;
				} else {
					return t;
				}
			}),
		);
	}

	function handleDeleteTask(taskId) {
		setTasks(tasks.filter((t) => t.id !== taskId));
	}

	// REDUCER способ =========
	const [tasks2, dispatch] = useReducer(tasksReducer, initialTasks);

	function handleAddTask(text) {
		dispatch({
			type: 'added',
			id: nextId++,
			text: text,
		});
	}

	function handleChangeTask(task) {
		dispatch({
			type: 'changed',
			task: task,
		});
	}

	function handleDeleteTask(taskId) {
		dispatch({
			type: 'deleted',
			id: taskId,
		});
	}

	function tasksReducer(tasks2, action) {
		if (action.type === 'added') {
			return [
				...tasks2,
				{
					id: action.id,
					text: action.text,
					done: false,
				},
			];
		} else if (action.type === 'changed') {
			return tasks.map((t) => {
				if (t.id === action.task.id) {
					return action.task;
				} else {
					return t;
				}
			});
		} else if (action.type === 'deleted') {
			return tasks2.filter((t) => t.id !== action.id);
		} else {
			throw Error('Unknown action: ' + action.type);
		}
	}
}

// ====================================================
function TaskApp() {
	const [tasks, dispatch] = useReducer(tasksReducer2, initialTasks);

	function handleAddTask(text) {
		dispatch({
			type: 'added',
			id: nextId++,
			text: text,
		});
	}

	function handleChangeTask(task) {
		dispatch({
			type: 'changed',
			task: task,
		});
	}

	function handleDeleteTask(taskId) {
		dispatch({
			type: 'deleted',
			id: taskId,
		});
	}

	return (
		<>
			<h1>Prague itinerary</h1>
			<AddTask onAddTask={handleAddTask} />
			<TaskList
				tasks={tasks}
				onChangeTask={handleChangeTask}
				onDeleteTask={handleDeleteTask}
			/>
		</>
	);
}

function tasksReducer2(tasks, action) {
	switch (action.type) {
		case 'added': {
			return [
				...tasks,
				{
					id: action.id,
					text: action.text,
					done: false,
				},
			];
		}
		case 'changed': {
			return tasks.map((t) => {
				if (t.id === action.task.id) {
					return action.task;
				} else {
					return t;
				}
			});
		}
		case 'deleted': {
			return tasks.filter((t) => t.id !== action.id);
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}

let nextId = 3;
const initialTasks = [
	{ id: 0, text: 'Visit Kafka Museum', done: true },
	{ id: 1, text: 'Watch a puppet show', done: false },
	{ id: 2, text: 'Lennon Wall pic', done: false },
];

// Reducer c помощью Immer =========
import { useImmerReducer } from 'use-immer';

function tasksReducer3(draft, action) {
	switch (action.type) {
		case 'added': {
			draft.push({
				id: action.id,
				text: action.text,
				done: false,
			});
			break;
		}
		case 'changed': {
			const index = draft.findIndex((t) => t.id === action.task.id);
			draft[index] = action.task;
			break;
		}
		case 'deleted': {
			return draft.filter((t) => t.id !== action.id);
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}

function TaskApp2() {
	const [tasks, dispatch] = useImmerReducer(tasksReducer3, initialTasks2);

	function handleAddTask(text) {
		dispatch({
			type: 'added',
			id: nextId2++,
			text: text,
		});
	}

	function handleChangeTask(task) {
		dispatch({
			type: 'changed',
			task: task,
		});
	}

	function handleDeleteTask(taskId) {
		dispatch({
			type: 'deleted',
			id: taskId,
		});
	}

	return (
		<>
			<h1>Prague itinerary</h1>
			<AddTask onAddTask={handleAddTask} />
			<TaskList
				tasks={tasks}
				onChangeTask={handleChangeTask}
				onDeleteTask={handleDeleteTask}
			/>
		</>
	);
}

let nextId2 = 3;
const initialTasks2 = [
	{ id: 0, text: 'Visit Kafka Museum', done: true },
	{ id: 1, text: 'Watch a puppet show', done: false },
	{ id: 2, text: 'Lennon Wall pic', done: false },
];

// ====================================================
/* 
1)Отправка действий из обработчиков событий:
В настоящее время обработчики событий в ContactList.js и Chat.js имеют комментарии // TODO . Вот почему ввод текста не работает, а нажатие на кнопки не меняет выбранного получателя.
Замените эти два // TODO кодом для dispatch соответствующих действий. Чтобы увидеть ожидаемую форму и тип действий, проверьте редуктор в messengerReducer.js . Редюсер уже написан, поэтому вам не нужно его менять. Вам нужно только отправить действия в ContactList.js и Chat.js


2)ЗАТЕМ СДЕЛАТЬ СЛЕДУЮЩЕЕ:
Очистить ввод при отправке сообщения
В настоящее время нажатие «Отправить» ничего не дает. Добавьте к кнопке «Отправить» обработчик событий, который будет:
1-Покажите alert с адресом электронной почты получателя и сообщением.
2-Очистите ввод сообщения.

3)ЗАТЕМ СДЕЛАТЬ СЛЕДУЮЩЕЕ:
Восстановление входных значений при переключении между вкладками
В этом примере переключение между разными получателями всегда очищает ввод текста:
Это связано с тем, что вы не хотите делиться одним черновиком сообщения с несколькими получателями. Но было бы лучше, если бы ваше приложение «запоминало» черновики для каждого контакта отдельно, восстанавливая их при переключении контактов.
Ваша задача — изменить структуру состояния, чтобы вы запоминали отдельный черновик сообщения для каждого контакта. Вам нужно будет внести несколько изменений в редуктор, исходное состояние и компоненты.
*/
function Chat({ contact, message, dispatch }) {
	return (
		<section className="chat">
			<textarea
				value={message}
				placeholder={'Chat to ' + contact.name}
				onChange={(e) => {
					// TODO: dispatch edited_message
					// (Read the input value from e.target.value)
					dispatch({
						type: 'edited_message',
						message: e.target.value,
					});
				}}
			/>
			<br />
			<button
				onClick={() => {
					alert(
						`Сообщение: ${message} \nОтправлено ${contact.name}'s (${contact.email})`,
					);
					dispatch({
						type: 'sent_message',
					});
				}}>
				Send to {contact.email}
			</button>
		</section>
	);
}

function ContactList({ contacts, selectedId, dispatch }) {
	return (
		<section className="contact-list">
			<ul>
				{contacts.map((contact) => (
					<li key={contact.id}>
						<button
							onClick={() => {
								// TODO: dispatch changed_selection
								dispatch({
									type: 'changed_selection',
									contactId: contact.id,
								});
							}}>
							{selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}

const initialState = {
	selectedId: 0,
	// message: 'Hello',
	messages: {
		0: 'Hello, Taylor', // Draft for contactId = 0
		1: 'Hello, Alice', // Draft for contactId = 1
		2: 'Hello, Bob', // Draft for contactId = 2
	},
};

function messengerReducer(state, action) {
	switch (action.type) {
		case 'changed_selection': {
			return {
				...state,
				selectedId: action.contactId,
				// message: '',
			};
		}
		case 'edited_message': {
			return {
				...state,
				// message: action.message,
				messages: {
					...state.messages,
					[state.selectedId]: action.message,
				},
			};
		}
		case 'sent_message': {
			return {
				...state,
				messages: {
					...state.messages,
					[state.selectedId]: '',
				},
			};
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}

function Messenger() {
	const [state, dispatch] = useReducer(messengerReducer, initialState);

	// const message = state.message;
	const message = state.messages[state.selectedId] || '';

	const contact = contacts.find((c) => c.id === state.selectedId);

	return (
		<div>
			<ContactList contacts={contacts} selectedId={state.selectedId} dispatch={dispatch} />
			<Chat key={contact.id} message={message} contact={contact} dispatch={dispatch} />
		</div>
	);
}

const contacts = [
	{ id: 0, name: 'Taylor', email: 'taylor@mail.com' },
	{ id: 1, name: 'Alice', email: 'alice@mail.com' },
	{ id: 2, name: 'Bob', email: 'bob@mail.com' },
];

// ====================================================
/* 
Реализация useReducer с нуля
*/
function useReducerCustom(reducer, initialState) {
	const [state, setState] = useState(initialState);

	function dispatch(action) {
		setState((prevState) => reducer(prevState, action));
		// Или так
		/* 
			const nextState = reducer(state, action);
			setState(nextState);
		*/
	}

	return [state, dispatch];
}
/* Проверка на простом примере */
function reducer(state, action) {
	switch (action.type) {
		case 'increment':
			return state + 1;
		case 'decrement':
			return state - 1;
		default:
			return state;
	}
}

function CounterTestReduser() {
	const [count, dispatch] = useReducerCustom(reducer, 0);

	return (
		<div>
			<p>Count: {count}</p>

			<button onClick={() => dispatch({ type: 'increment' })}>+</button>

			<button onClick={() => dispatch({ type: 'decrement' })}>-</button>
		</div>
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
			<Messenger />
			<hr />
			<CounterTestReduser />
			<hr />
		</>
	);
}

export default mainFunc;
