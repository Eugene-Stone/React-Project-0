/* 
	https://ru.react.dev/learn/rendering-lists
	Рендер списков
	
	Поменяйте код так, чтобы он показывал два списка один за другим: Химики и Все остальные. Как и раньше, вы можете определить, является ли человек химиком, проверив person.profession === 'химик'.
*/

function getImageUrl(person) {
	return 'https://i.imgur.com/' + person.imageId + 's.jpg';
}

const people = [
	{
		id: 0,
		name: 'Креола Кэтрин Джонсон (Creola Katherine Johnson)',
		profession: 'математик',
		accomplishment: 'расчёты для космических полетов',
		imageId: 'MK3eW3A',
	},
	{
		id: 1,
		name: 'Марио Молина (Mario José Molina-Pasquel Henríquez)',
		profession: 'химик',
		accomplishment: 'обнаружение дыр в озоновом слое',
		imageId: 'mynHUSa',
	},
	{
		id: 2,
		name: 'Мухаммад Абдус Салам (Mohammad Abdus Salam)',
		profession: 'физик',
		accomplishment: 'открытие теории электромагнетизма',
		imageId: 'bE7W1ji',
	},
	{
		id: 3,
		name: 'Перси Джулиан (Percy Lavon Julian)',
		profession: 'химик',
		accomplishment:
			'изобретение препаратов с кортизоном, стероидов и противозачаточных таблеток',
		imageId: 'IOjWm71',
	},
	{
		id: 4,
		name: 'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
		profession: 'астрофизик',
		accomplishment: 'расчёт массы белого карлика',
		imageId: 'lrWQx8l',
	},
];

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

function List() {
	const chemists = people.filter((person) => person.profession === 'химик');

	const notChemists = people.filter((person) => person.profession !== 'химик');

	return (
		<article>
			<ListItems title="Химики" people={chemists} />

			<ListItems title="Не Химики" people={notChemists} />
		</article>
	);
}

// ====================================================
/* 
	Создайте список рецептов из данного массива! Для каждого рецепта в массиве отобразите название внутри <h2> и перечислите ингредиенты в <ul>.
*/

import { Fragment } from 'react/jsx-runtime';

const recipes = [
	{
		id: 'greek-salad',
		name: 'Греческий салат',
		ingredients: ['помидоры', 'огурец', 'лук', 'оливки', 'сыр фета'],
	},
	{
		id: 'hawaiian-pizza',
		name: 'Гавайская пицца',
		ingredients: ['тесто для пиццы', 'соус для пиццы', 'моцарелла', 'ветчина', 'ананас'],
	},
	{
		id: 'hummus',
		name: 'Хумус',
		ingredients: ['нут', 'оливковое масло', 'зубчики чеснока', 'лимон', 'тахини'],
	},
];

function ReceiptList({ recipes }) {
	return (
		<>
			{recipes.map((recip) => (
				<Fragment key={recip.id}>
					<h2>{recip.name}</h2>

					<ul>
						{recip.ingredients.map((recipIngreient) => (
							<li key={recipIngreient}>{recipIngreient}</li>
						))}
					</ul>
				</Fragment>
			))}
		</>
	);
}

function RecipeList() {
	return (
		<div>
			<h1>Рецепты</h1>
			<ReceiptList recipes={recipes} />
		</div>
	);
}

// ====================================================
/* 
Компонент RecipeList содержит два вложенных вызова map. Чтобы упростить его, извлеките компонент Recipe, который будет принимать пропсы id, name и ingredients. Где вы разместите внешний key и почему?
*/

function Recipe({ id, name, ingredients }) {
	return (
		<div>
			<h2>{name}</h2>
			<ul>
				{ingredients.map((ingredient) => (
					<li key={ingredient}>{ingredient}</li>
				))}
			</ul>
		</div>
	);
}

function RecipeList2() {
	return (
		<div>
			<h1>Рецепты</h1>
			{recipes.map((recipe) => (
				<Recipe
					id={recipe.id}
					name={recipe.name}
					ingredients={recipe.ingredients}
					key={recipe.id}
				/>

				// Или так
				// <Recipe {...recipe} key={recipe.id} />
			))}
		</div>
	);
}

// ====================================================
/* 
Данный пример рендерит известное хокку Татибана Хокуси, каждая строка обернута в тег <p>. Ваша задача — вставить разделитель <hr /> между каждым параграфом. Ваша структура должна выглядеть так:
<article>
	<p>Я пишу, стираю, переписываю,</p>
	<hr />
	<p>Снова стереть, а затем</p>
	<hr />
	<p>Цветет мак.</p>
</article>
*/

const poem = {
	lines: ['Я пишу, стираю, переписываю,', 'Снова стереть, а затем', 'Цветет мак.'],
};

function Poem() {
	let hrLine = <hr />;
	return (
		<article>
			{poem.lines.map((line, index) => (
				<Fragment key={index}>
					{index !== 0 ? hrLine : ''}
					{/* 
						Или так
						{index > 0 && <hr />}
					*/}
					<p>{line}</p>
				</Fragment>
			))}
		</article>
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
			<List />
			<hr />
			<RecipeList />
			<hr />
			<RecipeList2 />
			<hr />
			<Poem />
			<hr />
		</>
	);
}

export default mainFunc;
