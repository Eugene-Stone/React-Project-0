/* 
	https://ru.react.dev/learn/escape-hatches
	Escape Hatches

	TaskDescription
*/
import { useState, useRef, useEffect } from 'react';

function Counter() {
	let ref = useRef(0);

	function handleClick() {
		ref.current = ref.current + 1;
		alert('You clicked ' + ref.current + ' times!');
	}

	return <button onClick={handleClick}>Click me!</button>;
}

function Form() {
	const inputRef = useRef(null);

	function handleClick() {
		inputRef.current.focus();
	}

	return (
		<>
			<input type="text" ref={inputRef} />

			<button onClick={handleClick}>focus input</button>
		</>
	);
}

// ====================================================
function VideoPlayer({ src, isPlaying }) {
	const ref = useRef(null);

	useEffect(() => {
		if (isPlaying) {
			ref.current.play();
		} else {
			ref.current.pause();
		}
	}, [isPlaying]);

	return <video ref={ref} src={src} loop playsInline />;
}

function VideoPlayerApp() {
	const [isPlaying, setIsPlaying] = useState(false);

	return (
		<>
			<button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
			<VideoPlayer
				isPlaying={isPlaying}
				src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
			/>
		</>
	);
}

// ====================================================
function ChatRoom() {
	useEffect(() => {
		const connection = createConnection();
		connection.connect();
		return () => connection.disconnect();
	}, []);
	return (
		<>
			<h1>Welcome to the chat!</h1>
		</>
	);
}

function createConnection() {
	// A real implementation would actually connect to the server
	return {
		connect() {
			console.log('✅ Connecting...');
		},
		disconnect() {
			console.log('❌ Disconnected.');
		},
	};
}

// ====================================================

function ChatApp() {
	const [roomId, setRoomId] = useState('general');
	return (
		<>
			<label>
				Choose the chat room:{' '}
				<select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
					<option value="general">general</option>
					<option value="travel">travel</option>
					<option value="music">music</option>
				</select>
			</label>
			<br />
			<ChatRoom2 roomId={roomId} />
		</>
	);
}

const serverUrl = 'https://localhost:1234';
function ChatRoom2({ roomId }) {
	useEffect(() => {
		const connection = createConnection2(serverUrl, roomId);
		connection.connect();
		return () => connection.disconnect();
	}, [roomId]);

	return <h1>Welcome to the {roomId} room!</h1>;
}

function createConnection2(serverUrl, roomId) {
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

// ====================================================
/* 
В этом примере пользовательский хук usePointerPosition отслеживает положение курсора, а пользовательский хук useDelayedValue возвращает значение, которое «отстает» от переданного вами значения на определенное количество миллисекунд. 
*/
function usePointerPosition() {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	useEffect(() => {
		function handleMove(e) {
			setPosition({ x: e.clientX, y: e.clientY });
		}
		window.addEventListener('pointermove', handleMove);
		return () => window.removeEventListener('pointermove', handleMove);
	}, []);
	return position;
}

function useDelayedValue(value, delay) {
	const [delayedValue, setDelayedValue] = useState(value);

	useEffect(() => {
		setTimeout(() => {
			setDelayedValue(value);
		}, delay);
	}, [value, delay]);

	return delayedValue;
}

function Canvas() {
	const pos1 = usePointerPosition();
	const pos2 = useDelayedValue(pos1, 100);
	const pos3 = useDelayedValue(pos2, 200);
	const pos4 = useDelayedValue(pos3, 100);
	const pos5 = useDelayedValue(pos4, 50);
	return (
		<div style={{ backgroundColor: '#eee' }}>
			<Dot position={pos1} opacity={1} />
			<Dot position={pos2} opacity={0.8} />
			<Dot position={pos3} opacity={0.6} />
			<Dot position={pos4} opacity={0.4} />
			<Dot position={pos5} opacity={0.2} />
		</div>
	);
}

function Dot({ position, opacity }) {
	return (
		<div
			style={{
				position: 'absolute',
				backgroundColor: 'pink',
				borderRadius: '50%',
				opacity,
				transform: `translate(${position.x}px, ${position.y}px)`,
				pointerEvents: 'none',
				left: -20,
				top: -20,
				width: 40,
				height: 40,
			}}
		/>
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
			<Counter />
			<hr />
			<Form />
			<hr />
			<VideoPlayerApp />
			<hr />
			<ChatRoom />
			<hr />
			<ChatApp />
			<hr />
			<Canvas />
			<hr />
		</>
	);
}

export default mainFunc;
