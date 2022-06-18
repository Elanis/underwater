import '../Menu.css';

export default function Controls({ quit }) {
	return (
		<>
			<div className="menu-controls">
				<ul>
					<li><h1>Controls</h1></li>

					<li><br/></li>

					<li><h2>Keyboard</h2></li>
					<li><img src="./img/keyboard/arrow_keys.png" /> Control submarine</li>
					<li><br/></li>
					<li><img src="./img/keyboard/spacebar.png" /> Shoot torpedoes</li>

					<li><br/></li>
					<li><br/></li>

					<li><h2>Gamepad</h2></li>
					<li>Left joystick - Control submarine</li>
					<li>Right buttons (X / Square) - Shoot torpedoes</li>

					<li id="credits-backToMenu"><a href="#menu" onClick={quit}>Back to menu</a></li>
				</ul>
			</div>
		</>
	);
}
