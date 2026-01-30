/* 
	https://ru.react.dev/learn/passing-data-deeply-with-context
	Глубокая передача данных с контекстом

	Контекст позволяет компоненту предоставлять некоторую информацию всему дереву под ним.
*/

function Heading({ level, children }) {
	switch (level) {
		case 1:
			return <h1>{children}</h1>;
		case 2:
			return <h2>{children}</h2>;
		case 3:
			return <h3>{children}</h3>;
		case 4:
			return <h4>{children}</h4>;
		case 5:
			return <h5>{children}</h5>;
		case 6:
			return <h6>{children}</h6>;
		default:
			throw Error('Unknown level: ' + level);
	}
}
function Section({ children }) {
	return <section className="section">{children}</section>;
}
function Page() {
	return (
		<>
			<Section>
				<Heading level={1}>Title</Heading>
				<Heading level={2}>Heading</Heading>
				<Heading level={3}>Sub-heading</Heading>
				<Heading level={4}>Sub-sub-heading</Heading>
				<Heading level={5}>Sub-sub-sub-heading</Heading>
				<Heading level={6}>Sub-sub-sub-sub-heading</Heading>
			</Section>
			<br />
			<Section>
				<Heading level={1}>Title</Heading>
				<Section>
					<Heading level={2}>Heading</Heading>
					<Heading level={2}>Heading</Heading>
					<Heading level={2}>Heading</Heading>
					<Section>
						<Heading level={3}>Sub-heading</Heading>
						<Heading level={3}>Sub-heading</Heading>
						<Heading level={3}>Sub-heading</Heading>
						<Section>
							<Heading level={4}>Sub-sub-heading</Heading>
							<Heading level={4}>Sub-sub-heading</Heading>
							<Heading level={4}>Sub-sub-heading</Heading>
						</Section>
					</Section>
				</Section>
				<br />
				<Section>
					<Heading level={6}>Heading</Heading>
					<Heading level={6}>Heading</Heading>
					<Heading level={6}>Heading</Heading>
				</Section>
			</Section>
		</>
	);
}

// ====================================================
import { useState, useContext, createContext } from 'react';
const LevelContext = createContext(1);

function HeadingWithContext({ children }) {
	const level = useContext(LevelContext);

	switch (level) {
		case 1:
			return <h1>{children}</h1>;
		case 2:
			return <h2>{children}</h2>;
		case 3:
			return <h3>{children}</h3>;
		case 4:
			return <h4>{children}</h4>;
		case 5:
			return <h5>{children}</h5>;
		case 6:
			return <h6>{children}</h6>;
		default:
			throw Error('Unknown level: ' + level);
	}
}
function SectionWithContext({ level, children }) {
	return (
		<div className="SectionWithContext" style={{ color: 'pink' }}>
			<LevelContext value={level}>{children}</LevelContext>
			{/* Или так */}
			{/* <LevelContext.Provider value={level}>{children}</LevelContext.Provider> */}
		</div>
	);
}

/* В таком случае не нужно укзаывать level в пропсах  */
function SectionWithContext2({ children }) {
	const level = useContext(LevelContext);
	return (
		<div className="SectionWithContext" style={{ color: 'pink' }}>
			<LevelContext value={level + 1}>{children}</LevelContext>
			{/* Или так */}
			{/* <LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider> */}
		</div>
	);
}
function PageWithContext() {
	return (
		<>
			<SectionWithContext level={1}>
				<HeadingWithContext>Title</HeadingWithContext>
				<HeadingWithContext>HeadingWithContext</HeadingWithContext>
				<HeadingWithContext>Sub-HeadingWithContext</HeadingWithContext>
				<HeadingWithContext>Sub-sub-HeadingWithContext</HeadingWithContext>
				<HeadingWithContext>Sub-sub-sub-HeadingWithContext</HeadingWithContext>
				<HeadingWithContext>Sub-sub-sub-sub-HeadingWithContext</HeadingWithContext>
			</SectionWithContext>
			<br />
			<SectionWithContext level={1}>
				<HeadingWithContext>Title</HeadingWithContext>
				<br />
				<SectionWithContext level={6}>
					<HeadingWithContext>HeadingWithContext</HeadingWithContext>
					<HeadingWithContext>HeadingWithContext</HeadingWithContext>
				</SectionWithContext>
			</SectionWithContext>

			<br />
			<SectionWithContext2>
				<HeadingWithContext>Title</HeadingWithContext>
				<SectionWithContext2>
					<HeadingWithContext>HeadingWithContext</HeadingWithContext>
					<SectionWithContext2>
						<HeadingWithContext>HeadingWithContext</HeadingWithContext>
						<SectionWithContext2>
							<HeadingWithContext>HeadingWithContext</HeadingWithContext>
							<SectionWithContext2>
								<HeadingWithContext>HeadingWithContext</HeadingWithContext>
							</SectionWithContext2>
						</SectionWithContext2>
					</SectionWithContext2>
				</SectionWithContext2>
			</SectionWithContext2>
		</>
	);
}

// ====================================================
/* 
Replace prop drilling with context
В этом примере переключение флажка изменяет свойство imageSize , передаваемое каждому <PlaceImage> . Состояние флажка хранится в компоненте App верхнего уровня, но каждый <PlaceImage> должен знать об этом.
В настоящее время App передает imageSize в List , который передает его каждому Place , который передает его в PlaceImage. Удалите свойство imageSize и вместо этого передайте его из компонента App непосредственно в PlaceImage .
*/

const places = [
	{
		id: 0,
		name: 'Bo-Kaap in Cape Town, South Africa',
		description:
			'The tradition of choosing bright colors for houses began in the late 20th century.',
		imageId: 'K9HVAGH',
	},
	{
		id: 1,
		name: 'Rainbow Village in Taichung, Taiwan',
		description:
			'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
		imageId: '9EAYZrt',
	},
	{
		id: 2,
		name: 'Macromural de Pachuca, Mexico',
		description:
			'One of the largest murals in the world covering homes in a hillside neighborhood.',
		imageId: 'DgXHVwu',
	},
	{
		id: 3,
		name: 'Selarón Staircase in Rio de Janeiro, Brazil',
		description:
			'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
		imageId: 'aeO3rpI',
	},
	{
		id: 4,
		name: 'Burano, Italy',
		description:
			'The houses are painted following a specific color system dating back to 16th century.',
		imageId: 'kxsph5C',
	},
	{
		id: 5,
		name: 'Chefchaouen, Marocco',
		description:
			'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
		imageId: 'rTqKo46',
	},
	{
		id: 6,
		name: 'Gamcheon Culture Village in Busan, South Korea',
		description:
			'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
		imageId: 'ZfQOOzf',
	},
];

function getImageUrl(place) {
	return 'https://i.imgur.com/' + place.imageId + 'l.jpg';
}

function PlaceImage({ place, imageSize }) {
	return <img src={getImageUrl(place)} alt={place.name} width={imageSize} height={imageSize} />;
}

function Place({ place, imageSize }) {
	return (
		<>
			<PlaceImage place={place} imageSize={imageSize} />
			<p>
				<b>{place.name}</b>
				{': ' + place.description}
			</p>
		</>
	);
}

function List({ imageSize }) {
	const listItems = places.map((place) => (
		<li key={place.id}>
			<Place place={place} imageSize={imageSize} />
		</li>
	));
	return <ul>{listItems}</ul>;
}

function App() {
	const [isLarge, setIsLarge] = useState(false);
	const imageSize = isLarge ? 150 : 100;
	return (
		<>
			<label>
				<input
					type="checkbox"
					checked={isLarge}
					onChange={(e) => {
						setIsLarge(e.target.checked);
					}}
				/>
				Use large images
			</label>
			<hr />
			<List imageSize={imageSize} />
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
function mainFunc() {
	return (
		<>
			<App />
			<hr />
			<Page />
			<hr />
			<PageWithContext />
			<hr />
		</>
	);
}

export default mainFunc;
