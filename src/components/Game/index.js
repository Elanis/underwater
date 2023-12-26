import { useState } from 'react';

import { Canvas2D, useGamepad, useKeyboard,  useWindowDimensions } from 'canvas2d-wrapper'

import calcGameLoop from '../../business/calcGameLoop';
import computeElementsList from '../../business/computeElementsList';

import './index.css';

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
	const gamepad = useGamepad();

	const onFrame = () => setState((currState) => calcGameLoop(width, height, keyboard, gamepad, currState));

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
			onFrame={onFrame}
		/>
	);
}
