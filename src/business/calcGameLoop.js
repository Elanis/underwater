function recalcProjectiles(projectiles, width) {
	return projectiles.map((elt) => {
				elt.x += 5;
				return elt;
	}).filter((elt) => elt.x < width * 1.5);
}

function computeSubmarinePos(height, keyboard, submarineY) {
	let newY = 0 + submarineY;
	if(keyboard['ArrowUp']) {
		newY -= 10;
	}
	if(keyboard['ArrowDown']) {
		newY += 10;
	}

	let maxDeltaYPos = 0.45 * height;
	if(newY < -maxDeltaYPos) {
		newY = -maxDeltaYPos;
	} else if(newY > maxDeltaYPos) {
		newY = maxDeltaYPos;
	}

	return newY;
}

let lastTorp = Date.now();
const TORP_INTERVAL = 500;
export default function calcGameLoop(width, height, keyboard, state) {
	const newState = {
		submarineY: state.submarineY
	};

	// Recalc physic
	newState.projectiles = recalcProjectiles(state.projectiles, width);

	// TODO: calc collisions

	// Keyboard
	newState.submarineY = computeSubmarinePos(height, keyboard, state.submarineY);

	if(keyboard[' '] && (Date.now() - lastTorp) > TORP_INTERVAL) {
		newState.projectiles.push({x: (-width * 0.4) + 80, y: newState.submarineY + 50 });
		lastTorp = Date.now();
	}

	return newState;
}