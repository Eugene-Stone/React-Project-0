/* 
	https://ru.react.dev/learn/reacting-to-input-with-state

	Реакция на вход с состоянием
*/
/* 
Сделайте так, чтобы при нажатии на изображение удален background--active, CSS class с внешнего <div>, но добавит Picture--активный класс к <img>. Повторный клик по фону должен восстановить исходные классы CSS.

Визуально стоит ожидать, что при нажатии на изображение убирается фиолетовый фон и выделяется граница изображения. Щелчок за пределами изображения подсвечивает фон, но убирает выделение края изображения.
*/
import { useState } from 'react';

function Picture() {
	const [isActive, setIsActive] = useState(true);

	const handleBackgroundClick = () => {
		isActive ? setIsActive(false) : setIsActive(true);
	};

	const handlePictureClick = (event) => {
		event.stopPropagation();
		isActive ? setIsActive(false) : setIsActive(true);
	};
	return (
		<div
			className={isActive ? 'background background--active' : 'background'}
			onClick={handleBackgroundClick}>
			<img
				className={isActive ? 'picture ' : 'picture picture--active'}
				alt="Rainbow houses in Kampung Pelangi, Indonesia"
				src="https://i.imgur.com/5qwVYb1.jpeg"
				onClick={handlePictureClick}
			/>
		</div>
	);
}

// ====================================================
/* 
Эта форма переключается между двумя режимами: в режиме редактирования вы видите входные данные, а в режиме просмотра — только результат. Метка кнопки меняется между «Редактировать» и «Сохранить» в зависимости от режима. Когда вы меняете входы, приветственное сообщение внизу обновляется в реальном времени.
*/
function EditProfile() {
	const [isEditing, setIsEditing] = useState(false);
	const [firstName, setFirstName] = useState('Jane');
	const [lastName, setLastName] = useState('Jacobs');

	return (
		<form>
			<label>
				First name:{' '}
				{isEditing ? (
					<input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
				) : (
					<b>{firstName}</b>
				)}
			</label>
			<label>
				Last name:{' '}
				{isEditing ? (
					<input value={lastName} onChange={(e) => setLastName(e.target.value)} />
				) : (
					<b>{lastName}</b>
				)}
			</label>
			<button
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					if (isEditing) {
						setIsEditing(false);
					} else {
						setIsEditing(true);
					}
				}}>
				{isEditing ? 'Save Profile' : 'Edit Profile'}
			</button>
			<p>
				<i>
					Hello, {firstName} {lastName}!
				</i>
			</p>
		</form>
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
			<Picture />
			<br />
			<br />
			<EditProfile />
			<br />
			<br />
		</>
	);
}

export default mainFunc;
