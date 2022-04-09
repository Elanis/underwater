import { Canvas2D, CanvasImage, Circle, Polygon, Rect, preloadImages } from 'canvas2d-wrapper'

import useWindowDimensions from './hooks/useWindowDimensions';

import './App.css';

const SUBMARINE_SRC = 'img/submarine.png';

preloadImages([
	SUBMARINE_SRC,
]);

export default function App() {
	const { width, height } = useWindowDimensions();

	const elements = [
		new CanvasImage({
			id: 'submarine',
			x: -width * 0.35,
			y: 0,
			width: 75,
			height: 75,
			zIndex: 10,
			draggable: false,
			src: SUBMARINE_SRC
		})
	];

	console.log(elements);

	return (
		<Canvas2D
			elements={elements}
			width={width}
			height={height}
			minZoom={1}
			maxZoom={1}
			tileSize={1}
			lockXAxis={true}
			lockYAxis={true}
		/>
	);
}
