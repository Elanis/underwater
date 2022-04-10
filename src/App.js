import { useState } from 'react';

import { Canvas2D, CanvasImage, Circle, Polygon, Rect, preloadImages } from 'canvas2d-wrapper'

import calcGameLoop from './business/calcGameLoop';
import computeElementsList from './business/computeElementsList';

import useKeyboard from './hooks/useKeyboard';
import useWindowDimensions from './hooks/useWindowDimensions';

import './App.css';

const GROUND_SRC = 'img/fishTile_003.png';
const SUBMARINE_SRC = 'img/submarine.png';
const TORPEDO_SRC = 'img/torpedo.png';

preloadImages([
	GROUND_SRC,
	SUBMARINE_SRC,
	TORPEDO_SRC,
]);

let lastUpdate = Date.now();

export default function App() {
	const { width, height } = useWindowDimensions();
	const [_, setShouldReRender] = useState(0);
	const [state, setState] = useState({
		submarineY: 0,
		projectiles: [],
	});
	const keyboard = useKeyboard();

	const render = () => {
		if((Date.now() - lastUpdate) < 15) {
			setTimeout(() => setShouldReRender(Date.now()), 15);
			return;
		}

		lastUpdate = Date.now();

		setState(calcGameLoop(width, height, keyboard, state));

		window.requestAnimationFrame(render);
	};

	window.requestAnimationFrame(render);

	return (
		<Canvas2D
			elements={computeElementsList(width, height, state)}
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
