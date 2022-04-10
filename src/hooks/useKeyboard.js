import { useEffect, useState } from 'react';

export default function useKeyboard() {
	const [keyboard, setKeyboard] = useState({});

	useEffect(() => {
		document.addEventListener('keydown', (e) => {
			keyboard[e.key] = true;
			setKeyboard(JSON.parse(JSON.stringify(keyboard)));
		});
		document.addEventListener('keyup', (e) => {
			keyboard[e.key] = false;
			setKeyboard(JSON.parse(JSON.stringify(keyboard)));
		});
	}, []);

	return keyboard;
}