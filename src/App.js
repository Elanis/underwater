import { useEffect, useState } from 'react';

import { Canvas2D, CanvasImage, Circle, Polygon, Rect, preloadImages } from 'canvas2d-wrapper'

import useWindowDimensions from './hooks/useWindowDimensions';

import './App.css';

const SUBMARINE_SRC = 'img/submarine.png';

preloadImages([
	SUBMARINE_SRC,
]);

let lastEvent = Date.now();

let previousFnOnEvent = null;

export default function App() {
	const { width, height } = useWindowDimensions();
	const [submarineY, setSubmarineY] = useState(0);

	useEffect(() => {
		const onChange = (e) => {
			if((Date.now() - lastEvent) < 25) {
				return;
			}

			const deltaYFromCenter = height * 0.45;

			switch(e.key) {
				case 'ArrowUp':
					setSubmarineY(Math.max(-deltaYFromCenter, submarineY - 10));
					break;
				case 'ArrowDown':
					setSubmarineY(Math.min(deltaYFromCenter, submarineY + 10));
					break;
			}

			lastEvent = Date.now();
		};

		if(previousFnOnEvent !== null) {
			document.removeEventListener('keydown', previousFnOnEvent);
		}
		document.addEventListener('keydown', onChange);
		previousFnOnEvent = onChange;
	}, [submarineY]);

	const elements = [
		new CanvasImage({
			id: 'submarine',
			x: -width * 0.4,
			y: submarineY,
			width: 75,
			height: 75,
			zIndex: 10,
			draggable: false,
			src: SUBMARINE_SRC
		})
	];

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
