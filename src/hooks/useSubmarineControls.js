import { useEffect } from 'react';

let lastEvent = Date.now();

let previousArrowFnOnEvent = null;
let previousTorpFnOnEvent = null;
let lastTorp = Date.now();
const TORP_INTERVAL = 1000;

export default function useSubmarineControls(submarineY, setSubmarineY, height, subColumn, projectiles, setProjectiles) {
	useEffect(() => {
		const onChangeArrows = (e) => {
			if((Date.now() - lastEvent) < 16) {
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
				default:
			}

			lastEvent = Date.now();
		};

		if(previousArrowFnOnEvent !== null) {
			document.removeEventListener('keydown', previousArrowFnOnEvent);
		}
		document.addEventListener('keydown', onChangeArrows);
		previousArrowFnOnEvent = onChangeArrows;
	}, [submarineY]);

	useEffect(() => {
		const onChangeTorp = (e) => {
			switch(e.key) {
				case ' ':
					if((Date.now() - lastTorp) > TORP_INTERVAL) {
						projectiles.push({x: subColumn + 80, y: submarineY + 50 });
						setProjectiles(projectiles);
						lastTorp = Date.now();
					}
					break;
				default:
			}
		};

		if(previousTorpFnOnEvent !== null) {
			document.removeEventListener('keydown', previousTorpFnOnEvent);
		}
		document.addEventListener('keydown', onChangeTorp);
		previousTorpFnOnEvent = onChangeTorp;
	}, [projectiles]);
}