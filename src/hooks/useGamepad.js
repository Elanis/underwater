import { useEffect, useState } from 'react';

let intervalId = 0;
export default function useGamepad() {
	const [gamepad, setGamepad] = useState();

	useEffect(() => {
		clearInterval(intervalId);
		intervalId = setInterval(() =>
			setGamepad(navigator.getGamepads()[0])
		, 15);
	}, []);

	return gamepad;
}