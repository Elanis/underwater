import { useEffect, useState } from 'react';

import Game from './components/Game';
import MainMenu from './components/MainMenu';
import Credits from './components/Credits';

import { startMusic } from './business/audio.js';

import './App.css';

startMusic();

const VIEW_GAME 			= 0;
const VIEW_MENU 			= 10;
const VIEW_CREDITS  		= 20;

let quit_target = VIEW_MENU;

export default function App() {
	const [currentView, setCurrentView] = useState(VIEW_MENU);

	const back = () => setCurrentView(quit_target);
	const backFromKeyboard = (e) => {
		if (e.keyCode === 27) {
			setCurrentView(quit_target);
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', backFromKeyboard, false);

		return () => {
			document.removeEventListener('keydown', backFromKeyboard, false);
		};
	}, []);

	quit_target = VIEW_MENU;
	let content = null;
	switch(currentView) {
		case VIEW_GAME:
			content = <Game quit={back} />;
			break;
		case VIEW_CREDITS:
			content = <Credits quit={back} />;
			break;
		default:
			content = (
				<MainMenu
					openGame={() => setCurrentView(VIEW_GAME)}
					openCredit={() => setCurrentView(VIEW_CREDITS)}
				/>
			);
	}

	return (
		<>
			{content}
		</>
	);
}
