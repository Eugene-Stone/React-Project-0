/* 
	https://ru.react.dev/learn/sharing-state-between-components
	Совместное использование состояния между компонентами

	TaskDescription
*/

import { useState } from 'react';

const panels = [
	{
		title: 'About',
		content: (
			<>
				With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929
				to 1997, it was its capital city.
			</>
		),
	},
	{
		title: 'Etymology',
		content: (
			<>
				The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and
				is often translated as "full of apples". In fact, the region surrounding Almaty is
				thought to be the ancestral home of the apple, and the wild{' '}
				<i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor
				of the modern domestic apple.
			</>
		),
	},
];

function Panel({ title, children, isActive, onShow }) {
	// const [isActive, setIsActive] = useState(false);
	return (
		<section className="panel">
			<h3>{title}</h3>
			{isActive ? <p>{children}</p> : <button onClick={() => onShow()}>Show</button>}

			{/* Или так */}
			{/* {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>} */}
		</section>
	);
}

function Accordion() {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<>
			<h2>Almaty, Kazakhstan</h2>
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

			{panels.map((panel, index) => {
				return (
					<Panel
						key={panel.title}
						title={panel.title}
						onShow={() => setActiveIndex(index)}
						isActive={activeIndex === index}>
						{panel.content}
					</Panel>
				);
			})}
		</>
	);
}

// ====================================================
/* 
Эти два входа независимы. Обеспечьте их синхронизацию: редактирование одного ввода должно привести к обновлению другого ввода тем же текстом, и наоборот.
 */
function SyncedInputs() {
	const [text, setText] = useState('');

	return (
		<>
			<Input onChangeProp={setText} text={text} label="First input" />
			<Input onChangeProp={setText} text={text} label="Second input" />
		</>
	);
}

function Input({ label, text, onChangeProp }) {
	return (
		<label>
			{label} <input value={text} onChange={(e) => onChangeProp(e.target.value)} />
		</label>
	);
}

// ====================================================
/* 
В этом примере SearchBar есть собственное состояние query , которое управляет вводом текста. Его родительский компонент FilterableList отображает List элементов, но не учитывает поисковый запрос.
Используйте функцию filterItems(foods, query) для фильтрации списка по поисковому запросу. Чтобы проверить изменения, убедитесь, что ввод «s» во входные данные отфильтровывает список до «Суши», «Шашлык» и «Димсам».
*/

function filterItems(items, query) {
	query = query.toLowerCase();
	return items.filter((item) =>
		item.name.split(' ').some((word) => word.toLowerCase().startsWith(query)),
	);
}

const foods = [
	{
		id: 0,
		name: 'Sushi',
		description: 'Sushi is a traditional Japanese dish of prepared vinegared rice',
	},
	{
		id: 1,
		name: 'Dal',
		description:
			'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added',
	},
	{
		id: 2,
		name: 'Pierogi',
		description:
			'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water',
	},
	{
		id: 3,
		name: 'Shish kebab',
		description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.',
	},
	{
		id: 4,
		name: 'Dim sum',
		description:
			'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch',
	},
];

function SearchBar({ onChangeProp, query }) {
	return (
		<label>
			Search: <input value={query} onChange={(e) => onChangeProp(e.target.value)} />
		</label>
	);
}

function List({ items }) {
	return (
		<table>
			<tbody>
				{items.map((food) => (
					<tr key={food.id}>
						<td>{food.name}</td>
						<td>{food.description}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function FilterableList() {
	const [query, setQuery] = useState('');
	const filteredFoods = filterItems(foods, query);

	// function handleChange(e) {
	// 	setQuery(e);
	// 	// filterItems(foods, query);
	// }

	return (
		<>
			<SearchBar query={query} onChangeProp={setQuery} />
			<hr />
			{/* <List items={foods} /> */}
			<List items={filteredFoods} />
		</>
	);
}

// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================
function mainFunc() {
	return (
		<>
			<Accordion />
			<br />
			<br />
			<SyncedInputs />
			<br />
			<br />
			<FilterableList />
			<br />
			<br />
		</>
	);
}

export default mainFunc;
