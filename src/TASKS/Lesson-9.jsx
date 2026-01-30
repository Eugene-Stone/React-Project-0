/* 
	https://ru.react.dev/learn/managing-state
	Managing State
*/
import { useState } from 'react';

function Form() {
	const [answer, setAnswer] = useState('');
	const [error, setError] = useState(null);
	const [status, setStatus] = useState('typing');

	if (status === 'success') {
		return <h1>That's right!</h1>;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setStatus('submitting');
		try {
			await submitForm(answer);
			setStatus('success');
		} catch (err) {
			setStatus('typing');
			setError(err);
		}
	}

	function handleTextareaChange(e) {
		setAnswer(e.target.value);
	}

	return (
		<>
			<h2>City quiz</h2>
			<p>In which city is there a billboard that turns air into drinkable water?</p>
			<form onSubmit={handleSubmit}>
				<textarea
					value={answer}
					onChange={handleTextareaChange}
					disabled={status === 'submitting'}
				/>
				<br />
				<button disabled={answer.length === 0 || status === 'submitting'}>Submit</button>
				{error !== null && <p className="Error">{error.message}</p>}
			</form>
		</>
	);
}

function submitForm(answer) {
	// Pretend it's hitting the network.
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			let shouldError = answer.toLowerCase() !== 'lima';
			if (shouldError) {
				reject(new Error('Good guess but a wrong answer. Try again!'));
			} else {
				resolve();
			}
		}, 1500);
	});
}

// ========================
function Form2() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	const fullName = firstName + ' ' + lastName;

	function handleFirstNameChange(e) {
		setFirstName(e.target.value);
	}

	function handleLastNameChange(e) {
		setLastName(e.target.value);
	}

	return (
		<>
			<h2>Let’s check you in</h2>
			<label>
				First name: <input value={firstName} onChange={handleFirstNameChange} />
			</label>
			<label>
				Last name: <input value={lastName} onChange={handleLastNameChange} />
			</label>
			<p>
				Your ticket will be issued to: <b>{fullName}</b>
			</p>
		</>
	);
}

// ==============
function Accordion() {
	const [activeIndex, setActiveIndex] = useState(0);

	const accordionItems = [
		{
			title: 'About',
			text: `With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.`,
		},
		{
			title: 'Etymology',
			text: `With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.`,
		},
		{
			title: 'Etymology asdasd',
			text: `With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997,   asdasdasd a dsa jdakdait was its capital city.`,
		},
	];

	return (
		<>
			<h2>Almaty, Kazakhstan</h2>

			{accordionItems.map((accordionItem, index) => (
				<Panel
					key={index}
					title={accordionItem.title + ' ' + index}
					isActive={activeIndex === index}
					onShow={() => setActiveIndex(index)}>
					{accordionItem.text}
				</Panel>
			))}

			{/* <Panel title="About" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>
				With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929
				to 1997, it was its capital city.
			</Panel>
			<Panel title="Etymology" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>
				The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and
				is often translated as "full of apples". In fact, the region surrounding Almaty is
				thought to be the ancestral home of the apple, and the wild{' '}
				<i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor
				of the modern domestic apple.
			</Panel> */}
		</>
	);
}

function Panel({ title, children, isActive, onShow }) {
	return (
		<section className="panel">
			<h3>{title}</h3>
			{isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
		</section>
	);
}

// ====================================================
function ContactList({ selectedContact, contacts, onSelect }) {
	return (
		<section className="contact-list">
			<ul>
				{contacts.map((contact) => (
					<li key={contact.email}>
						<button
							onClick={() => {
								onSelect(contact);
							}}>
							{contact.name}
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}

function Chat({ contact }) {
	const [text, setText] = useState('');
	return (
		<section className="chat">
			<textarea
				value={text}
				placeholder={'Chat to ' + contact.name}
				onChange={(e) => setText(e.target.value)}
			/>
			<br />
			<button>Send to {contact.email}</button>
		</section>
	);
}

function Messenger() {
	const [to, setTo] = useState(contacts[0]);
	return (
		<div>
			<ContactList
				contacts={contacts}
				selectedContact={to}
				onSelect={(contact) => setTo(contact)}
			/>
			<Chat key={to.email} contact={to} />
		</div>
	);
}

const contacts = [
	{ name: 'Taylor', email: 'taylor@mail.com' },
	{ name: 'Alice', email: 'alice@mail.com' },
	{ name: 'Bob', email: 'bob@mail.com' },
];

// ================================================

import { useReducer } from 'react';

function AddTask({ onAddTask }) {
	const [text, setText] = useState('');
	return (
		<>
			<input placeholder="Add task" value={text} onChange={(e) => setText(e.target.value)} />
			<button
				onClick={() => {
					setText('');
					onAddTask(text);
				}}>
				Add
			</button>
		</>
	);
}

function TaskList({ tasks, onChangeTask, onDeleteTask }) {
	return (
		<ul>
			{tasks.map((task) => (
				<li key={task.id}>
					<Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
				</li>
			))}
		</ul>
	);
}

function Task({ task, onChange, onDelete }) {
	const [isEditing, setIsEditing] = useState(false);
	let taskContent;
	if (isEditing) {
		taskContent = (
			<>
				<input
					value={task.text}
					onChange={(e) => {
						onChange({
							...task,
							text: e.target.value,
						});
					}}
				/>
				<button onClick={() => setIsEditing(false)}>Save</button>
			</>
		);
	} else {
		taskContent = (
			<>
				{task.text}
				<button onClick={() => setIsEditing(true)}>Edit</button>
			</>
		);
	}
	return (
		<label>
			<input
				type="checkbox"
				checked={task.done}
				onChange={(e) => {
					onChange({
						...task,
						done: e.target.checked,
					});
				}}
			/>
			{taskContent}
			<button onClick={() => onDelete(task.id)}>Delete</button>
		</label>
	);
}

function tasksReducer(tasks, action) {
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

function TaskApp() {
	const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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

// ================================================
import { useContext } from 'react';
import { createContext } from 'react';
const LevelContext = createContext(0);

function Heading({ children }) {
	const level = useContext(LevelContext);
	switch (level) {
		case 0:
			throw Error('Heading must be inside a Section!');
		case 1:
			return <h1>{children}</h1>;
		case 2:
			return <h2>{children}</h2>;
		case 3:
			return <h3>{children}</h3>;
		case 4:
			return <h4>{children}</h4>;
		case 5:
			return <h5>{children}</h5>;
		case 6:
			return <h6>{children}</h6>;
		default:
			throw Error('Unknown level: ' + level);
	}
}

function Section({ children }) {
	const level = useContext(LevelContext);
	return (
		<section className="section">
			<LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider>
		</section>
	);
}

function Page() {
	return (
		<Section>
			<Heading>Title</Heading>
			<Section>
				<Heading>Heading</Heading>
				<Heading>Heading</Heading>
				<Heading>Heading</Heading>
				<Section>
					<Heading>Sub-heading</Heading>
					<Heading>Sub-heading</Heading>
					<Heading>Sub-heading</Heading>
					<Section>
						<Heading>Sub-sub-heading</Heading>
						<Heading>Sub-sub-heading</Heading>
						<Heading>Sub-sub-heading</Heading>
					</Section>
				</Section>
			</Section>
		</Section>
	);
}

// ================================================
// ================================================
// ================================================
// ================================================
// ================================================
// ================================================
// ================================================
// ================================================
function mainFunc() {
	return (
		<>
			<Form />
			<br />
			<br />
			<Form2 />
			<br />
			<br />
			<Accordion />
			<br />
			<br />
			<Messenger />
			<br />
			<br />
			<TaskApp />
			<br />
			<br />
			<Page />
			<br />
			<br />
		</>
	);
}

export default mainFunc;
