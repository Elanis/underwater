import { useState } from 'react';

import { Canvas2D } from 'canvas2d-wrapper'

import calcGameLoop from '../../business/calcGameLoop';
import computeElementsList from '../../business/computeElementsList';

import useGamepad from '../../hooks/useGamepad';
import useKeyboard from '../../hooks/useKeyboard';
import useWindowDimensions from '../../hooks/useWindowDimensions';

import './index.css';

let lastUpdate = Date.now();
export default function Game({ quit }) {
	const { width, height } = useWindowDimensions();
	const [state, setState] = useState({
		explosions: [],
		fishes: [],
		lost: false,
		projectiles: [],
		score: 0,
		submarineX: -width * 0.4, 
		submarineY: 0,
	});
	const keyboard = useKeyboard();
	const gamepad= useGamepad();

	const render = () => {
		if((Date.now() - lastUpdate) < 15) {
			return;
		}

		lastUpdate = Date.now();

		setState(calcGameLoop(width, height, keyboard, gamepad, state));
	};
	window.requestAnimationFrame(render);

	if(state.lost) {
		return (
			<div className="score-result">
				You lost<br/>
				Score: <span>{Math.round(state.score)}</span><br/>
				<span className="score-result-button" onClick={quit}>Back to menu</span>
			</div>
		)
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
