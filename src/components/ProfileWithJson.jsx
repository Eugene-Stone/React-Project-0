export function ProfileWithJson({ image }) {
	// console.log(image);
	return (
		<div style={{ marginRight: '20px' }}>
			<img src={image.src} alt={image.alt} /> <div>{image.alt}</div>
		</div>
	);
}
// https://eugene-stone.great-site.net/_temp/profileImages.json
