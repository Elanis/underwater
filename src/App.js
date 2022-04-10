import { useState } from 'react';

import { Canvas2D } from 'canvas2d-wrapper'

import calcGameLoop from './business/calcGameLoop';
import computeElementsList from './business/computeElementsList';

import useKeyboard from './hooks/useKeyboard';
import useWindowDimensions from './hooks/useWindowDimensions';

import './App.css';

let lastUpdate = Date.now();
export default function App() {
	const { width, height } = useWindowDimensions();
	const [state, setState] = useState({
		score: 0,
		submarineX: -width * 0.4, 
		submarineY: 0,
		projectiles: [],
		fishes: [],
		lost: false,
	});
	const keyboard = useKeyboard();

	const render = () => {
		if((Date.now() - lastUpdate) < 15) {
			return;
		}

		lastUpdate = Date.now();

		setState(calcGameLoop(width, height, keyboard, state));
	};

	window.requestAnimationFrame(render);

	if(state.lost) {
		return <span>Lost</span>
	}

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
