/* 
	https://ru.react.dev/learn/responding-to-events
	Responding to Events
	
*/

/* 
Нажатие этой кнопки должно переключать фон страницы между белым и чёрным. Однако при нажатии ничего не происходит. Решите проблему.
*/
function LightSwitch() {
	function handleClick() {
		let bodyStyle = document.body.style;
		if (bodyStyle.backgroundColor === 'black') {
			bodyStyle.backgroundColor = 'white';
		} else {
			bodyStyle.backgroundColor = 'black';
		}
	}

	return <button onClick={handleClick}>Toggle the lights</button>;
}

// ====================================================
/* Этот компонент ColorSwitch отображает кнопку. Он должен менять цвет страницы. Подключите его к onChangeColor, который он получает от родителя, чтобы нажатие кнопки меняло цвет.

После этого обратите внимание, что нажатие кнопки увеличивает счётчик кликов по странице. Ваш коллега, написавший основной компонент, настаивает, что onChangeColor, не увеличивает счётчики. Что ещё может происходить? Исправьте так, чтобы нажатие кнопки меняло только цвет и не увеличивало счётчик. */

/* 
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}

*/

// Исправлный вариант
function ColorSwitch({ onChangeColor }) {
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				onChangeColor();
			}}>
			Change color
		</button>
	);
}

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
			<LightSwitch />
			<hr />
			<ColorSwitch />
			<hr />
		</>
	);
}

export default mainFunc;
