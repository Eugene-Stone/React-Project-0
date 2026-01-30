import { Profile, profileImages } from './components/Profile.jsx';

import { ProfileWithJson } from './components/ProfileWithJson.jsx';
import profileImagesJson from './data/profileImages.json';

import { Gallery } from './components/Gallery.jsx';

function TestComp({ testProps }) {
	const text = testProps ? ' - ' + testProps : ' - None props';

	return <div>123{text}</div>;
}

function GeneralComponent({ testProps }) {
	const listProfiles = profileImages.map((image, index) => <Profile key={index} image={image} />);

	return (
		<>
			<TestComp testProps={testProps} />

			<section className="gallery" style={{ marginTop: '20px', display: 'flex' }}>
				{listProfiles}
			</section>

			<br />

			<h2 style={{ marginTop: '30px' }}>Gallery with JSON</h2>
			<section className="gallery" style={{ marginTop: '20px', display: 'flex' }}>
				{profileImagesJson.map((image, index) => (
					<ProfileWithJson key={index} image={image} />
				))}
			</section>

			<br />

			<h2 style={{ marginTop: '30px' }}>Gallery with JSON from SERVER</h2>
			<Gallery />
		</>
	);
}

export default function App() {
	return <GeneralComponent testProps="testText" />;
}
