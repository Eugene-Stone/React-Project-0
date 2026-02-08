/* 
	https://ru.react.dev/learn/separating-events-from-effects
	Separating Events from Effects
	
	======AND======

*/
import { useState, useEffect, useEffectEvent } from 'react';

/* С помощью этого кода вы можете быть уверены, что всегда существует активное соединение с выбранным в данный момент сервером чата, независимо от конкретных взаимодействий, выполняемых пользователем. */
export function sendMessage(message, roomId) {
	console.log('🔵 You sent: ' + message + ' from ' + roomId);
}

export function createConnection(serverUrl, roomId) {
	// A real implementation would actually connect to the server
	return {
		connect() {
			console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
		},
		disconnect() {
			console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
		},
	};
}

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
	const [message, setMessage] = useState('');

	const onConnected = useEffectEvent(() => {
		console.log('Connected on ' + theme);
	});

	useEffect(() => {
		const connection = createConnection(serverUrl, roomId);
		connection.connect();

		onConnected();

		return () => connection.disconnect();
	}, [roomId]);

	function handleSendClick() {
		sendMessage(message, roomId);
	}

	return (
		<div>
			<h1>Welcome to the {roomId} room!</h1>
			<input value={message} onChange={(e) => setMessage(e.target.value)} />
			<button onClick={handleSendClick}>Send</button>
		</div>
	);
}

function App() {
	const [roomId, setRoomId] = useState('general');
	const [show, setShow] = useState(false);
	const [isDark, setIsDark] = useState(true);
	return (
		<div>
			<label>
				Choose the chat room:{' '}
				<select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
					<option value="general">general</option>
					<option value="travel">travel</option>
					<option value="music">music</option>
				</select>
			</label>
			<button onClick={() => setShow(!show)}>{show ? 'Close chat' : 'Open chat'}</button>
			{show && <br />}
			{show && <ChatRoom theme={isDark ? 'dark' : 'light'} key={roomId} roomId={roomId} />}
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
			<App />
			<hr />
		</>
	);
}

export default mainFunc;
