import { useState } from 'react';

import { Canvas2D, CanvasImage, Circle, Polygon, Rect, preloadImages } from 'canvas2d-wrapper'

import useSubmarineControls from './hooks/useSubmarineControls';
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
	const [submarineY, setSubmarineY] = useState(0);
	const [projectiles, setProjectiles] = useState([]);

	const subColumn = -width * 0.4;

	useSubmarineControls(
		submarineY, setSubmarineY,
		height, subColumn,
		projectiles, setProjectiles
	);

	const elements = [
		new CanvasImage({
			id: 'submarine',
			x: subColumn,
			y: submarineY,
			width: 75,
			height: 75,
			zIndex: 10,
			draggable: false,
			src: SUBMARINE_SRC
		}),
		...projectiles.map((elt, i) =>
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
			return;
		}

		lastUpdate = Date.now();

		setProjectiles(projectiles.map((elt) => {
			elt.x += 5;
			return elt;
		}).filter((elt) => elt.x < width * 1.5));

		window.requestAnimationFrame(render);
	};

	window.requestAnimationFrame(render);

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
