import { useEffect, useState } from 'react';

import { Profile } from './Profile.jsx';

export function Gallery() {
	const [images, setImages] = useState([]);

	useEffect(() => {
		// Аналог как с сервера
		fetch('/data/profileImages.json')
			.then((res) => res.json())
			.then((data) => setImages(data))
			.catch((err) => console.error('Ошибка загрузки:', err)); // Всегда добавляй catch!
	}, []);

	return (
		<section className="gallery" style={{ marginTop: '20px', display: 'flex' }}>
			{images.map((image, index) => (
				<Profile key={index} image={image} />
			))}
		</section>
	);
}
