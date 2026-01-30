/* 
	https://ru.react.dev/learn/updating-arrays-in-state
	Updating Arrays in State

	Работа с массивами
*/
import { useState } from 'react';

// Добавление в массив
let nextId = 0;
function List() {
	const [name, setName] = useState('');
	const [artists, setArtists] = useState([]);

	return (
		<>
			<h1>Inspiring sculptors:</h1>
			<input value={name} onChange={(e) => setName(e.target.value)} />
			<button
				onClick={() => {
					setArtists([...artists, { id: nextId++, name: name }]);

					// Или так
					// setArtists([
					// 	{ id: nextId++, name: name },
					// 	...artists, // Put old items at the end
					// ]);
				}}>
				Add
			</button>
			<ul>
				{artists.map((artist) => (
					<li key={artist.id}>{artist.name}</li>
				))}
			</ul>
		</>
	);
}

// Удаление из массива
let initialArtists = [
	{ id: 0, name: 'Marta Colvin Andrade' },
	{ id: 1, name: 'Lamidi Olonade Fakeye' },
	{ id: 2, name: 'Louise Nevelson' },
];

function List2() {
	const [artists, setArtists] = useState(initialArtists);

	return (
		<>
			<h1>Inspiring sculptors:</h1>
			<ul>
				{artists.map((artist) => (
					<li key={artist.id}>
						{artist.name}{' '}
						<button
							onClick={() => {
								setArtists(artists.filter((a) => a.id !== artist.id));
							}}>
							Delete
						</button>
					</li>
				))}
			</ul>
		</>
	);
}

// Преобразование массива
let initialShapes = [
	{ id: 0, type: 'circle', x: 50, y: 100 },
	{ id: 1, type: 'square', x: 100, y: 100 },
	{ id: 2, type: 'circle', x: 150, y: 100 },
];

function ShapeEditor() {
	const [shapes, setShapes] = useState(initialShapes);

	function handleClick() {
		const nextShapes = shapes.map((shape) => {
			if (shape.type === 'square') {
				// No change
				return shape;
			} else {
				// Return a new circle 50px below
				return {
					...shape,
					y: shape.y + 50,
				};
			}
		});
		// Re-render with the new array
		setShapes(nextShapes);
	}

	return (
		<>
			<button onClick={handleClick}>Move circles down!</button>
			{shapes.map((shape) => (
				<div
					key={shape.id}
					style={{
						background: 'purple',
						position: 'absolute',
						left: shape.x,
						top: shape.y,
						borderRadius: shape.type === 'circle' ? '50%' : '',
						width: 20,
						height: 20,
					}}
				/>
			))}
		</>
	);
}

// Замена элементов в массиве
let initialCounters = [0, 0, 0];

function CounterList() {
	const [counters, setCounters] = useState(initialCounters);

	function handleIncrementClick(index) {
		const nextCounters = counters.map((c, i) => {
			if (i === index) {
				// Increment the clicked counter
				return c + 1;
			} else {
				// The rest haven't changed
				return c;
			}
		});
		setCounters(nextCounters);
	}

	return (
		<ul>
			{counters.map((counter, i) => (
				<li key={i}>
					{counter}
					<button
						onClick={() => {
							handleIncrementClick(i);
						}}>
						+1
					</button>
				</li>
			))}
		</ul>
	);
}

// Вставка в массив
let nextId2 = 3;
const initialArtists2 = [
	{ id: 0, name: 'Marta Colvin Andrade' },
	{ id: 1, name: 'Lamidi Olonade Fakeye' },
	{ id: 2, name: 'Louise Nevelson' },
];

function List3() {
	const [name, setName] = useState('');
	const [artists, setArtists] = useState(initialArtists2);

	function handleClick() {
		const insertAt = 1; // Could be any index
		const nextArtists = [
			// Items before the insertion point:
			...artists.slice(0, insertAt),
			// New item:
			{ id: nextId2++, name: name },
			// Items after the insertion point:
			...artists.slice(insertAt),
		];
		setArtists(nextArtists);
		setName('');
	}

	return (
		<>
			<h1>Inspiring sculptors:</h1>
			<input value={name} onChange={(e) => setName(e.target.value)} />
			<button onClick={handleClick}>Insert</button>
			<ul>
				{artists.map((artist) => (
					<li key={artist.id}>{artist.name}</li>
				))}
			</ul>
		</>
	);
}

// Внесение других изменений в массив

// REVERSE
function List4() {
	const initialList = [
		{ id: 0, title: 'Big Bellies' },
		{ id: 1, title: 'Lunar Landscape' },
		{ id: 2, title: 'Terracotta Army' },
	];

	const [list, setList] = useState(initialList);

	function handleClick() {
		const nextList = [...list];
		nextList.reverse();
		setList(nextList);
	}

	return (
		<>
			<button onClick={handleClick}>Reverse</button>
			<ul>
				{list.map((artwork) => (
					<li key={artwork.id}>{artwork.title}</li>
				))}
			</ul>
		</>
	);
}

// Обновление объектов внутри массивов
function BucketList() {
	// let nextId3 = 3;
	const initialList = [
		{ id: 0, title: 'Big Bellies', seen: false },
		{ id: 1, title: 'Lunar Landscape', seen: false },
		{ id: 2, title: 'Terracotta Army', seen: true },
	];

	const [myList, setMyList] = useState(initialList);
	const [yourList, setYourList] = useState(initialList);

	/* 
		С помощью Immer

		const [myList, updateMyList] = useImmer(
			initialList
		);
	*/

	function handleToggleMyList(artworkId, nextSeen) {
		setMyList(
			myList.map((artwork) => {
				if (artwork.id === artworkId) {
					// Create a *new* object with changes
					return { ...artwork, seen: nextSeen };
				} else {
					// No changes
					return artwork;
				}
			}),
		);

		/* 
			Обновлние массива с помощьью Immer

			updateMyList(draft => {
				const artwork = draft.find(a =>
					a.id === id
				);
				artwork.seen = nextSeen;
			});
		*/
	}

	function handleToggleYourList(artworkId, nextSeen) {
		setYourList(
			yourList.map((artwork) => {
				if (artwork.id === artworkId) {
					return { ...artwork, seen: nextSeen };
				} else {
					return artwork;
				}
			}),
		);
	}

	return (
		<>
			<h1>Art Bucket List</h1>
			<h2>My list of art to see:</h2>
			<ItemList artworks={myList} onToggle={handleToggleMyList} />
			<h2>Your list of art to see:</h2>
			<ItemList artworks={yourList} onToggle={handleToggleYourList} />
		</>
	);
}

function ItemList({ artworks, onToggle }) {
	return (
		<ul>
			{artworks.map((artwork) => (
				<li key={artwork.id}>
					<label>
						<input
							type="checkbox"
							checked={artwork.seen}
							onChange={(e) => {
								onToggle(artwork.id, e.target.checked);
							}}
						/>
						{artwork.title}
					</label>
				</li>
			))}
		</ul>
	);
}

// ====================================================

/* 1 - Заполните handleIncreaseClick, чтобы нажатие "+" увеличивало соответствующее число:

2 - В этой корзинке есть рабочая кнопка «+», но кнопка «–» ничего не делает. Нужно добавить обработчик событий, чтобы нажатие уменьшило count соответствующего произведения. Если нажать «–», когда счёт равен 1, товар автоматически должен быть удалён из корзины. Убедитесь, что он никогда не показывает 0. */

const initialProducts = [
	{
		id: 0,
		name: 'Baklava',
		count: 1,
	},
	{
		id: 1,
		name: 'Cheese',
		count: 5,
	},
	{
		id: 2,
		name: 'Spaghetti',
		count: 2,
	},
];

function ShoppingCart() {
	const [products, setProducts] = useState(initialProducts);

	let newArray;

	function handleIncreaseClick(productId) {
		newArray = products.map((product) => {
			if (product.id === productId) {
				return {
					...product,
					count: product.count + 1,
				};
			} else {
				return product;
			}
		});

		return setProducts(newArray);
	}

	function handleDecreaseClick(productId) {
		newArray = products.map((product) => {
			if (product.id === productId) {
				// return { ...product, count: product.count - 1 };
				return {
					...product,
					count: product.count > 0 ? product.count - 1 : 0,
				};
			} else {
				return product;
			}
		});

		return setProducts(newArray);
	}

	function handleRemoveClick(productId) {
		// newArray = products.filter((product) => product.id !== productId);

		// Или так
		newArray = products.filter((product) => {
			return product.id !== productId;
		});

		return setProducts(newArray);
	}

	return (
		<ul>
			{products.map((product) => (
				<li key={product.id}>
					{product.name} (<b>{product.count}</b>)
					<button
						onClick={() => {
							handleIncreaseClick(product.id);
						}}>
						+
					</button>
					<button
						onClick={() => {
							handleDecreaseClick(product.id);
						}}>
						-
					</button>
					<button
						onClick={() => {
							handleRemoveClick(product.id);
						}}>
						Remove product
					</button>
				</li>
			))}
		</ul>
	);
}

/* 
В этом примере все обработчики событий в App.js используют мутацию. В результате редактирование и удаление всех вещей не работает. Rewrite handleAddTodo, handleChangeTodo, и handleDeleteTodo для использования немутационных методов:

*/

function AddTodo({ onAddTodo }) {
	const [title, setTitle] = useState('');
	return (
		<>
			<input
				placeholder="Add todo"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<button
				onClick={() => {
					setTitle('');
					onAddTodo(title);
				}}>
				Add
			</button>
		</>
	);
}

function TaskList({ todos, onChangeTodo, onDeleteTodo }) {
	return (
		<ul>
			{todos.map((todo) => (
				<li key={todo.id}>
					<Task todo={todo} onChange={onChangeTodo} onDelete={onDeleteTodo} />
				</li>
			))}
		</ul>
	);
}

function Task({ todo, onChange, onDelete }) {
	const [isEditing, setIsEditing] = useState(false);
	let todoContent;
	if (isEditing) {
		todoContent = (
			<>
				<input
					value={todo.title}
					onChange={(e) => {
						onChange({
							...todo,
							title: e.target.value,
						});
					}}
				/>
				<button onClick={() => setIsEditing(false)}>Save</button>
			</>
		);
	} else {
		todoContent = (
			<>
				{todo.title}
				<button onClick={() => setIsEditing(true)}>Edit</button>
			</>
		);
	}
	return (
		<label>
			<input
				type="checkbox"
				checked={todo.done}
				onChange={(e) => {
					onChange({
						...todo,
						done: e.target.checked,
					});
				}}
			/>
			{todoContent}
			<button onClick={() => onDelete(todo.id)}>Delete</button>
		</label>
	);
}

let nextId3 = 3;
const initialTodos = [
	{
		id: 0,
		title: 'Buy milk',
		done: true,
	},
	{
		id: 1,
		title: 'Eat tacos',
		done: false,
	},
	{
		id: 2,
		title: 'Brew tea',
		done: false,
	},
];

function TaskApp() {
	const [todos, setTodos] = useState(initialTodos);

	function handleAddTodo(title) {
		return setTodos([
			...todos,
			{
				id: nextId3++,
				title: title,
				done: false,
			},
		]);
		// todos.push({
		// 	id: nextId3++,
		// 	title: title,
		// 	done: false,
		// });
	}

	function handleChangeTodo(nextTodo) {
		// const todo = todos.find((t) => t.id === nextTodo.id);
		// todo.title = nextTodo.title;
		// todo.done = nextTodo.done;

		return setTodos(
			todos.map((todo) => {
				if (todo.id !== nextTodo.id) {
					return todo;
				} else {
					return {
						...todo,
						id: nextTodo.id,
						title: nextTodo.title,
						done: nextTodo.done,
					};
				}
			}),
		);
	}

	function handleDeleteTodo(todoId) {
		// const index = todos.findIndex((t) => t.id === todoId);
		// todos.splice(index, 1);
		return setTodos(todos.filter((todo) => todo.id !== todoId));
	}

	return (
		<>
			<AddTodo onAddTodo={handleAddTodo} />
			<TaskList
				todos={todos}
				onChangeTodo={handleChangeTodo}
				onDeleteTodo={handleDeleteTodo}
			/>
		</>
	);
}

import { useImmer } from 'use-immer';
function TaskAppWithImmer() {
	const [todos, updateTodos] = useImmer(initialTodos);

	function handleAddTodo(title) {
		updateTodos((draft) => {
			draft.push({
				id: nextId3++,
				title: title,
				done: false,
			});
		});

		// return setTodos([
		// 	...todos,
		// 	{
		// 		id: nextId3++,
		// 		title: title,
		// 		done: false,
		// 	},
		// ]);

		// todos.push({
		// 	id: nextId3++,
		// 	title: title,
		// 	done: false,
		// });
	}

	function handleChangeTodo(nextTodo) {
		updateTodos((draft) => {
			const todo = draft.find((t) => t.id === nextTodo.id);
			if (todo) {
				todo.title = nextTodo.title;
				todo.done = nextTodo.done;
			}
		});

		// return setTodos(
		// 	todos.map((todo) => {
		// 		if (todo.id !== nextTodo.id) {
		// 			return todo;
		// 		} else {
		// 			return {
		// 				...todo,
		// 				id: nextTodo.id,
		// 				title: nextTodo.title,
		// 				done: nextTodo.done,
		// 			};
		// 		}
		// 	}),
		// );

		// const todo = todos.find((t) => t.id === nextTodo.id);
		// todo.title = nextTodo.title;
		// todo.done = nextTodo.done;
	}

	function handleDeleteTodo(todoId) {
		// Рабочий но не лучший вариант
		// updateTodos((draft) =>
		// 	draft.filter((d) => {
		// 		return d.id !== todoId;
		// 	}),
		// );

		// Лучше так
		updateTodos((draft) => {
			const index = draft.findIndex((d) => d.id === todoId);
			if (index !== -1) {
				draft.splice(index, 1);
			}
		});

		// return setTodos(todos.filter((todo) => todo.id !== todoId));

		// const index = todos.findIndex((t) => t.id === todoId);
		// todos.splice(index, 1);
	}

	return (
		<>
			<AddTodo onAddTodo={handleAddTodo} />
			<TaskList
				todos={todos}
				onChangeTodo={handleChangeTodo}
				onDeleteTodo={handleDeleteTodo}
			/>
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
// ====================================================
// ====================================================

function mainFunc() {
	return (
		<>
			<List />
			<hr />
			<List2 />
			<hr />
			<ShapeEditor />
			<hr />
			<CounterList />
			<hr />
			<List3 />
			<hr />
			<List4 />
			<hr />
			<BucketList />
			<hr />
			<ShoppingCart />
			<hr />
			<TaskApp />
			<hr />
			<TaskAppWithImmer />
			<hr />
		</>
	);
}

export default mainFunc;
