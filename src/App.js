import { useState } from 'react';

import { Canvas2D, CanvasImage, Circle, Polygon, Rect, preloadImages } from 'canvas2d-wrapper'

import calcGameLoop from './business/calcGameLoop';

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

	const elements = [
		new CanvasImage({
			id: 'submarine',
			x: -width * 0.4,
			y: state.submarineY,
			width: 75,
			height: 75,
			zIndex: 10,
			draggable: false,
			src: SUBMARINE_SRC
		}),
		...state.projectiles.map((elt, i) =>
			new CanvasImage({
				id: `torp-${i}`,
				x: elt.x,
				y: elt.y,
				width: 25,
				height: 25,
				zIndex: 15,
				draggable: false,
				src: TORPEDO_SRC
			})
		),
		...Array.from({length: Math.ceil(width/50) * 2}, (elt, i) =>
			new CanvasImage({
				id: `ground-${i}`,
				x: (-0.5 * width) + 50 * i - ((Date.now() / 25) % 50),
				y: height / 2 - 50,
				width: 50,
				height: 50,
				zIndex: 15,
				draggable: false,
				src: GROUND_SRC
			})
		)
	];

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
