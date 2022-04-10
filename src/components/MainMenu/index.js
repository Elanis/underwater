import openLink from '../../business/openLink';

import '../Menu.css';

export default function MainMenu({ openGame, openCredit }) {
	return (
		<>
			<div className="main-menu">
				<p className="main-menu-title"><h1>Underwater</h1></p>
				<p className="main-menu-link" onClick={openGame}>Game</p>
				<p className="main-menu-link" onClick={openCredit}>Credits</p>
			</div>

			<div className="social-buttons">
				<p>Find us on ...</p>
				<span onClick={() => openLink('https://discord.gg/c8aARey')}><img src="./img/social/discord.svg" alt="Discord" /></span>
				<span onClick={() => openLink('https://www.reddit.com/r/Dysnomia/')}><img src="./img/social/reddit.svg" alt="Reddit"/></span>
				<span onClick={() => openLink('https://www.twitch.tv/elanis42')}><img src="./img/social/twitch.svg" alt="Twitch"/></span>
				<span onClick={() => openLink('https://twitter.com/DysnomiaStudio')}><img src="./img/social/twitter.svg" alt="Twitter"/></span>
				<span onClick={() => openLink('https://www.youtube.com/channel/UCRvjwfwFAX3qXbGhLgi5NPg')}><img src="./img/social/youtube.svg" alt="YouTube"/></span>
			</div>
		</>
	);
}
