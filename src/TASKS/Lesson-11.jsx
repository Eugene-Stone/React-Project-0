/* 
	https://ru.react.dev/learn/choosing-the-state-structure
	Choosing the State Structure
*/
import { useState } from 'react';

const initialItems = [
	{ title: 'pretzels', id: 0 },
	{ title: 'crispy seaweed', id: 1 },
	{ title: 'granola bar', id: 2 },
];

function Menu() {
	const [items, setItems] = useState(initialItems);
	const [selectedId, setSelectedId] = useState(0);

	let selectedItem = items.find((item) => item.id === selectedId);

	function handleItemChange(id, e) {
		setItems(
			items.map((item) => {
				if (item.id === id) {
					return {
						...item,
						title: e.target.value,
					};
				} else {
					return item;
				}
			}),
		);
	}

	return (
		<>
			<h2>What's your travel snack?</h2>
			<ul>
				{items.map((item, index) => (
					<li key={item.id}>
						<input
							value={item.title}
							onChange={(e) => {
								handleItemChange(item.id, e);
							}}
						/>{' '}
						<button
							onClick={() => {
								setSelectedId(item.id);
							}}>
							Choose
						</button>
					</li>
				))}
			</ul>
			<p>You picked {selectedItem.title}.</p>
		</>
	);
}

// ================================================
/* 
Этот код работает, но есть небольшой сбой в пользовательском интерфейсе. Когда вы нажимаете «Звездочка» или «Снять звездочку», подсветка на мгновение исчезает. Однако он появляется снова, как только вы перемещаете указатель или переключаетесь на другую букву с помощью клавиатуры. Почему это происходит? Исправьте, чтобы подсветка не пропадала после нажатия кнопки.
 */
function Letter({ letter, isHighlighted, onHover, onToggleStar }) {
	return (
		<li
			className={isHighlighted ? 'highlighted' : ''}
			onFocus={() => {
				onHover(letter);
			}}
			onPointerMove={() => {
				onHover(letter);
			}}>
			<button
				onClick={() => {
					onToggleStar(letter);
				}}>
				{letter.isStarred ? 'Unstar' : 'Star'}
			</button>
			{letter.subject}
		</li>
	);
}

const initialLetters = [
	{
		id: 0,
		subject: 'Ready for adventure?',
		isStarred: true,
	},
	{
		id: 1,
		subject: 'Time to check in!',
		isStarred: false,
	},
	{
		id: 2,
		subject: 'Festival Begins in Just SEVEN Days!',
		isStarred: false,
	},
];

function MailClient() {
	const [letters, setLetters] = useState(initialLetters);
	const [highlightedId, setHighlightedId] = useState(null);

	function handleHover(letter) {
		setHighlightedId(letter.id);
	}

	function handleStar(starred) {
		setLetters(
			letters.map((letter) => {
				if (letter.id === starred.id) {
					return {
						...letter,
						isStarred: !letter.isStarred,
					};
				} else {
					return letter;
				}
			}),
		);
	}

	return (
		<>
			<h2>Inbox</h2>
			<ul>
				{letters.map((letter) => (
					<Letter
						key={letter.id}
						letter={letter}
						isHighlighted={letter.id === highlightedId}
						onHover={handleHover}
						onToggleStar={handleStar}
					/>
				))}
			</ul>
		</>
	);
}

// ================================================
/* 
В этом примере каждая Letter имеет свойство isSelected и обработчик onToggle , который помечает ее как выбранную. Это работает, но состояние сохраняется как selectedId ( null или идентификатор), поэтому в любой момент времени можно выбрать только одну букву.

Измените структуру состояния для поддержки множественного выбора. (Как бы вы его структурировали? Подумайте об этом перед написанием кода.) Каждый флажок должен стать независимым от других. Нажатие на выбранную букву должно снять флажок. Наконец, нижний колонтитул должен отображать правильное количество выбранных элементов.
 */
const letters = [
	{
		id: 0,
		subject: 'Ready for adventure?',
		isStarred: true,
	},
	{
		id: 1,
		subject: 'Time to check in!',
		isStarred: false,
	},
	{
		id: 2,
		subject: 'Festival Begins in Just SEVEN Days!',
		isStarred: false,
	},
];

function Letter2({ letter, onToggle, isSelected }) {
	return (
		<li className={isSelected ? 'selected' : ''}>
			<label>
				<input
					type="checkbox"
					checked={isSelected}
					onChange={() => {
						onToggle(letter.id);
					}}
				/>
				{letter.subject}
			</label>
		</li>
	);
}

function MailClient2() {
	const [selectedIds, setSelectedIds] = useState([]);

	// TODO: allow multiple selection
	const selectedCount = selectedIds.length;

	function handleToggle(toggledId) {
		// TODO: allow multiple selection
		setSelectedIds((prev) => {
			// Was it previously selected?
			if (prev.includes(toggledId)) {
				// Then remove this ID from the array.
				return prev.filter((id) => id !== toggledId);
			} else {
				// Otherwise, add this ID to the array.
				return [...prev, toggledId];
			}
		});
	}

	// Или так
	/* 
	function handleToggle(toggledId) {
			// Was it previously selected?
			if (selectedIds.includes(toggledId)) {
					// Then remove this ID from the array.
					setSelectedIds(selectedIds.filter(id =>
							id !== toggledId
					));
			} else {
					// Otherwise, add this ID to the array.
					setSelectedIds([
							...selectedIds,
							toggledId
					]);
			}
	}
	*/

	// Или так
	/* 
	const [selectedIds, setSelectedIds] = useState(
			new Set()
	);

	function handleToggle(toggledId) {
			// Create a copy (to avoid mutation).
			const nextIds = new Set(selectedIds);
			if (nextIds.has(toggledId)) {
					nextIds.delete(toggledId);
			} else {
					nextIds.add(toggledId);
			}
			setSelectedIds(nextIds);
	}

	*/

	return (
		<>
			<h2>Inbox</h2>
			<ul>
				{letters.map((letter) => (
					<Letter2
						key={letter.id}
						letter={letter}
						isSelected={
							// TODO: allow multiple selection
							selectedIds.includes(letter.id)
						}
						onToggle={handleToggle}
					/>
				))}
				<hr />
				<p>
					<b>You selected {selectedCount} letters</b>
				</p>
			</ul>
		</>
	);
}

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
			<Menu />
			<br />
			<br />
			<MailClient />
			<br />
			<br />
			<MailClient2 />
			<br />
			<br />
		</>
	);
}

export default mainFunc;
