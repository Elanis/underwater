import { useEffect } from 'react';

let lastEvent = Date.now();

let previousFnOnEvent = null;

export default function useSubmarineControls(submarineY, setSubmarineY, height) {
	useEffect(() => {
		const onChange = (e) => {
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
			}

			lastEvent = Date.now();
		};

		if(previousFnOnEvent !== null) {
			document.removeEventListener('keydown', previousFnOnEvent);
		}
		document.addEventListener('keydown', onChange);
		previousFnOnEvent = onChange;
	}, [submarineY]);
}