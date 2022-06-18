import '../Menu.css';

export default function Credits({ quit }) {
	return (
		<>
			<div className="menu-credits">
				<ul>
					<li><h1>Credits</h1></li>

					<li><b>Developer:</b> Axel "Elanis" Soupé</li>
					<li><br/></li>
					<li><b>External assets:</b></li>
					<li>• <b>Particles:</b> <a href="https://www.kenney.nl/assets/particle-pack" title="particles">Kenney.nl</a></li>
					<li>• <b>Submarine:</b> <a href="https://www.flaticon.com/free-icons/ocean" title="ocean icons">Ocean icons created by Freepik - Flaticon</a></li>
					<li>• <b>Tiles:</b> <a href="https://www.kenney.nl/assets/fish-pack" title="tiles">Kenney.nl</a></li>
					<li>• <b>Torpedoe:</b> <a href="https://www.flaticon.com/free-icons/bomb" title="bomb icons">Bomb icons created by Freepik - Flaticon</a></li>
					<li>• <b>Explosion sound:</b> <a href="https://freesound.org/s/268557/" title="explosion sound">Explosion_001.mp3 by cydon</a></li>

					<li id="credits-backToMenu"><a href="#menu" onClick={quit}>Back to menu</a></li>
				</ul>
			</div>
		</>
	);
}
