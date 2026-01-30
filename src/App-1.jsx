const people = [
	'Креола Кэтрин Джонсон (Creola Katherine Johnson): математик',
	'Марио Молина (Mario José Molina-Pasquel Henríquez): химик',
	'Мухаммад Абдус Салам (Mohammad Abdus Salam): физик',
	'Перси Джулиан (Percy Lavon Julian): химик',
	'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar): астрофизик',
];

function List() {
	const listItems = people.map((person, index) => (
		<li key={index}>
			{person} {index + 1}
		</li>
	));
	return <ul>{listItems}</ul>;
}

function getImageUrl(person) {
	return 'https://i.imgur.com/' + person.imageId + 's.jpg';
}

const people2 = [
	{
		id: 0, // Используется в JSX в качестве ключа
		name: 'Креола Кэтрин Джонсон (Creola Katherine Johnson)',
		profession: 'математик',
		accomplishment: 'расчёты для космических полетов',
		imageId: 'MK3eW3A',
	},
	{
		id: 1, // Используется в JSX в качестве ключа
		name: 'Марио Молина (Mario José Molina-Pasquel Henríquez)',
		profession: 'химик',
		accomplishment: 'обнаружение дыр в озоновом слое',
		imageId: 'mynHUSa',
	},
	{
		id: 2, // Используется в JSX в качестве ключа
		name: 'Мухаммад Абдус Салам (Mohammad Abdus Salam)',
		profession: 'физик',
		accomplishment: 'открытие теории электромагнетизма',
		imageId: 'bE7W1ji',
	},
	{
		id: 3, // Используется в JSX в качестве ключа
		name: 'Перси Джулиан (Percy Lavon Julian)',
		profession: 'химик',
		accomplishment:
			'изобретение препаратов с кортизоном, стероидов и противозачаточных таблеток',
		imageId: 'IOjWm71',
	},
	{
		id: 4, // Используется в JSX в качестве ключа
		name: 'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
		profession: 'астрофизик',
		accomplishment: 'расчёт массы белого карлика',
		imageId: 'lrWQx8l',
	},
];

export default function List2() {
	const chemists = people2.filter((person) => person.profession === 'химик');

	const listItemsChemics = chemists.map((person) => (
		<li key={person.id}>
			<img src={getImageUrl(person)} alt={person.name} />

			<div>
				{person.name} {'id=' + (person.id + 1)}
			</div>
			<div>Достижения - {person.accomplishment}</div>
		</li>
	));
	return <ul>{listItemsChemics}</ul>;
}

/* 
Как поступить, если каждый элемент должен отображать не один, а несколько DOM-узлов?

Краткий синтаксис <>...</> фрагмента не позволяет передавать ключ, поэтому нужно либо объединить их в один <div>, либо использовать чуть более длинный и более явный <Fragment>:

import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
*/

// import { people } from './data.js';
// import { getImageUrl } from './utils.js';

function ListItems({ title, people }) {
	return (
		<>
			<h1>{title}</h1>

			<ul>
				{people.map((person) => (
					<li key={person.id}>
						<img src={getImageUrl(person)} alt={person.name} />
						<p>
							<b>{person.name}:</b>
							{' ' + person.profession}. Достижение: {person.accomplishment}
						</p>
					</li>
				))}
			</ul>
		</>
	);
}

/* 
ИЛИ МОЖНО ТАК, ВМЕСТО filter
let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'химик') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});
*/

// export default function List3() {
function List3() {
	const chemists = people.filter((person) => person.profession === 'химик');

	const notChemists = people.filter((person) => person.profession !== 'химик');

	return (
		<article>
			<ListItems title="Химики" people={chemists} />

			<ListItems title="Не Химики" people={notChemists} />
		</article>
	);
}
