export const profileImages = [
	{
		src: 'https://i.imgur.com/MK3eW3As.jpg',
		alt: 'Katherine 1',
		theme: {
			color: 'pink',
		},
	},
	{
		src: 'https://i.imgur.com/QIrZWGIs.jpg',
		alt: 'Katherine 2',
		theme: {
			color: 'blue',
		},
	},
	{
		src: 'https://i.imgur.com/yXOvdOSs.jpg',
		alt: 'Katherine 3',
		theme: {
			color: 'orange',
		},
	},
];

export function Profile({ image }) {
	// console.log(image);
	let imageColor;
	if (image.theme) {
		imageColor = image.theme.color;
	} else {
		imageColor = 'green';
	}
	return (
		<div style={{ marginRight: '20px' }}>
			<img src={image.src} alt={image.alt} />
			<div style={{ color: imageColor }}>{image.alt}</div>
			{/* Или так, если есть цвет в json  */}
			<div style={{ color: image.theme && image.theme.color }}>{image.alt}</div>
		</div>
	);
}
