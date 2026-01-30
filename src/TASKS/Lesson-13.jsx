/* 
	https://ru.react.dev/learn/preserving-and-resetting-state
	Сохранение и сброс состояния

	TaskDescription
*/
import { useState } from 'react';

function Counter() {
	const [score, setScore] = useState(0);
	const [hover, setHover] = useState(false);

	let className = 'counter';
	if (hover) {
		className += ' hover';
	}

	return (
		<div
			className={className}
			onPointerEnter={() => setHover(true)}
			onPointerLeave={() => setHover(false)}>
			<h1>{score}</h1>
			<button onClick={() => setScore(score + 1)}>Add one</button>
		</div>
	);
}
function App() {
	const counter = <Counter />;
	return (
		<div>
			{counter}
			{counter}
		</div>
	);
}

// ====================================================
function Scoreboard() {
	const [isPlayerA, setIsPlayerA] = useState(true);
	return (
		<div>
			{isPlayerA ? (
				<Counter2 key="Taylor" person="Taylor" />
			) : (
				<Counter2 key="Sarah" person="Sarah" />
			)}
			<button
				onClick={() => {
					setIsPlayerA(!isPlayerA);
				}}>
				Next player!
			</button>
		</div>
	);
}

function Counter2({ person }) {
	const [score, setScore] = useState(0);
	const [hover, setHover] = useState(false);

	let className = 'counter';
	if (hover) {
		className += ' hover';
	}

	return (
		<div
			className={className}
			onPointerEnter={() => setHover(true)}
			onPointerLeave={() => setHover(false)}>
			<h1>
				{person}'s score: {score}
			</h1>
			<button onClick={() => setScore(score + 1)}>Add one</button>
		</div>
	);
}

// ====================================================
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
function ContactList({ selectedContact, contacts, onSelect }) {
	return (
		<section className="contact-list">
			<ul>
				{contacts.map((contact) => (
					<li key={contact.id}>
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

function Messenger() {
	const [to, setTo] = useState(contacts[0]);
	return (
		<div>
			<ContactList
				contacts={contacts}
				selectedContact={to}
				onSelect={(contact) => setTo(contact)}
			/>
			<Chat key={to.id} contact={to} />
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
В этом примере показано сообщение при нажатии кнопки. Однако нажатие кнопки также случайно сбрасывает вход. Почему это происходит? Исправьте так, чтобы нажатие кнопки не сбрасывало вводимый текст
*/
function App2() {
	const [showHint, setShowHint] = useState(false);
	const [text, setText] = useState('');

	return (
		<div>
			{showHint && (
				<p>
					<i>Hint: Your favorite city?</i>
				</p>
			)}
			<Form text={text} setText={setText} />
			<button
				onClick={() => {
					setShowHint(!showHint);
				}}>
				Show hint
			</button>
		</div>
	);
}

function Form({ text, setText }) {
	return <textarea value={text} onChange={(e) => setText(e.target.value)} />;
}

// ====================================================
/* В этой форме вы можете ввести имя и фамилию. Он также имеет флажок, определяющий, какое поле идет первым. При установке флажка поле «Фамилия» появится перед полем «Имя».
Почти работает, но есть ошибка. Если вы заполните поле «Имя» и установите флажок, текст останется в первом поле ввода (теперь это «Фамилия»). Исправьте это так, чтобы вводимый текст также перемещался при изменении порядка.
 */
function App3() {
	const [reverse, setReverse] = useState(false);
	let checkbox = (
		<label>
			<input
				type="checkbox"
				checked={reverse}
				onChange={(e) => setReverse(e.target.checked)}
			/>
			Reverse order
		</label>
	);
	if (reverse) {
		return (
			<>
				<Field key="Last name" label="Last name" />
				<Field key="First name" label="First name" />
				{checkbox}
			</>
		);
	} else {
		return (
			<>
				<Field key="First name" label="First name" />
				<Field key="Last name" label="Last name" />
				{checkbox}
			</>
		);
	}
}

function Field({ label }) {
	const [text, setText] = useState('');
	return (
		<label>
			{label}:{' '}
			<input
				type="text"
				value={text}
				placeholder={label}
				onChange={(e) => setText(e.target.value)}
			/>
		</label>
	);
}

// ====================================================
/* 
Сбросить форму детализации
Это редактируемый список контактов. Вы можете отредактировать данные выбранного контакта, а затем либо нажать «Сохранить», чтобы обновить их, либо «Сбросить», чтобы отменить изменения.
Когда вы выбираете другой контакт (например, Алису), состояние обновляется, но в форме продолжают отображаться сведения о предыдущем контакте. Исправьте это, чтобы форма сбрасывалась при изменении выбранного контакта.
*/
function ContactList2({ contacts, selectedId, onSelect }) {
	return (
		<section>
			<ul>
				{contacts.map((contact) => (
					<li key={contact.id}>
						<button
							onClick={() => {
								onSelect(contact.id);
							}}>
							{contact.id === selectedId ? <b>{contact.name}</b> : contact.name}
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}

function EditContact({ initialData, onSave }) {
	const [name, setName] = useState(initialData.name);
	const [email, setEmail] = useState(initialData.email);
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
						id: initialData.id,
						name: name,
						email: email,
					};
					onSave(updatedData);
				}}>
				Save
			</button>
			<button
				onClick={() => {
					setName(initialData.name);
					setEmail(initialData.email);
				}}>
				Reset
			</button>
		</section>
	);
}

function ContactManager() {
	const [contacts, setContacts] = useState(initialContacts2);
	const [selectedId, setSelectedId] = useState(0);
	const selectedContact = contacts.find((c) => c.id === selectedId);

	function handleSave(updatedData) {
		const nextContacts = contacts.map((c) => {
			if (c.id === updatedData.id) {
				return updatedData;
			} else {
				return c;
			}
		});
		setContacts(nextContacts);
	}

	return (
		<div>
			<ContactList2
				contacts={contacts}
				selectedId={selectedId}
				onSelect={(id) => setSelectedId(id)}
			/>
			<hr />
			<EditContact key={selectedId} initialData={selectedContact} onSave={handleSave} />
		</div>
	);
}

const initialContacts2 = [
	{ id: 0, name: 'Taylor', email: 'taylor@mail.com' },
	{ id: 1, name: 'Alice', email: 'alice@mail.com' },
	{ id: 2, name: 'Bob', email: 'bob@mail.com' },
];

// ====================================================
/* 
 Очистить изображение во время загрузки
 Когда вы нажимаете «Далее», браузер начинает загрузку следующего изображения. Однако, поскольку оно отображается в том же теге <img> , по умолчанию вы все равно увидите предыдущее изображение, пока не загрузится следующее. Это может быть нежелательно, если важно, чтобы текст всегда соответствовал изображению. Измените его так, чтобы в момент нажатия «Далее» предыдущее изображение сразу же очищалось.
*/
function Gallery() {
	const [index, setIndex] = useState(0);
	const hasNext = index < images.length - 1;

	function handleClick() {
		if (hasNext) {
			setIndex(index + 1);
		} else {
			setIndex(0);
		}
	}

	let image = images[index];
	return (
		<>
			<button onClick={handleClick}>Next</button>
			<h3>
				Image {index + 1} of {images.length}
			</h3>
			<img key={image.place} src={image.src} width={300} height={300} />
			<p>{image.place}</p>
		</>
	);
}

let images = [
	{
		place: 'Penang, Malaysia',
		src: 'https://i.imgur.com/FJeJR8M.jpg',
	},
	{
		place: 'Lisbon, Portugal',
		src: 'https://i.imgur.com/dB2LRbj.jpg',
	},
	{
		place: 'Bilbao, Spain',
		src: 'https://i.imgur.com/z08o2TS.jpg',
	},
	{
		place: 'Valparaíso, Chile',
		src: 'https://i.imgur.com/Y3utgTi.jpg',
	},
	{
		place: 'Schwyz, Switzerland',
		src: 'https://i.imgur.com/JBbMpWY.jpg',
	},
	{
		place: 'Prague, Czechia',
		src: 'https://i.imgur.com/QwUKKmF.jpg',
	},
	{
		place: 'Ljubljana, Slovenia',
		src: 'https://i.imgur.com/3aIiwfm.jpg',
	},
];

// ====================================================
/* Исправьте неправильно расположенный состояние в списке
В этом списке каждый Contact имеет состояние, которое определяет, была ли для него нажата кнопка «Показать электронную почту». Нажмите «Показать электронную почту» для Алисы, а затем установите флажок «Показать в обратном порядке». Вы заметите, что электронная почта Тейлора теперь развернута, а электронная почта Алисы, которая переместилась вниз, выглядит свернутой.
Исправьте так, чтобы развернутое состояние ассоциировалось с каждым контактом независимо от выбранного порядка.
*/
function Contact2({ contact }) {
	const [expanded, setExpanded] = useState(false);
	return (
		<>
			<p>
				<b>{contact.name}</b>
			</p>
			{expanded && (
				<p>
					<i>{contact.email}</i>
				</p>
			)}
			<button
				onClick={() => {
					setExpanded(!expanded);
				}}>
				{expanded ? 'Hide' : 'Show'} email
			</button>
		</>
	);
}

function ContactList3() {
	const [reverse, setReverse] = useState(false);

	const displayedContacts = [...contacts2];
	if (reverse) {
		displayedContacts.reverse();
	}

	return (
		<>
			<label>
				<input
					type="checkbox"
					checked={reverse}
					onChange={(e) => {
						setReverse(e.target.checked);
					}}
				/>{' '}
				Show in reverse order
			</label>
			<ul>
				{displayedContacts.map((contact, i) => (
					<li key={contact.id}>
						<Contact2 contact={contact} />
					</li>
				))}
			</ul>
		</>
	);
}

const contacts2 = [
	{ id: 0, name: 'Alice', email: 'alice@mail.com' },
	{ id: 1, name: 'Bob', email: 'bob@mail.com' },
	{ id: 2, name: 'Taylor', email: 'taylor@mail.com' },
];

// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================
function mainFunc() {
	return (
		<>
			<App />
			<hr />
			<Scoreboard />
			<hr />
			<Messenger />
			<hr />
			<App2 />
			<hr />
			<App3 />
			<hr />
			<ContactManager />
			<hr />
			<Gallery />
			<hr />
			<ContactList3 />
			<hr />
		</>
	);
}

export default mainFunc;
