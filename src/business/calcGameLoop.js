import {
	FISH_SIZE,
	TORPEDO_SIZE,
} from '../constants/sizes.js';

const FISH_SCORE = 100;

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
	} else if(newY > (maxDeltaYPos - 100)) { // 100 = submarine size
		newY = maxDeltaYPos - 100;
	}

	return newY;
}

function recalcFishes(score, fishes, width, height) {
	const newFishes = fishes.filter((elt) => elt.x > (-0.8 * width) && elt.x < (0.8 * width))

	for(let i = newFishes.length; i < (Math.floor(score / 30)); i++) {
		newFishes.push({
			index: Math.floor(Math.random() * 9),
			x: Math.floor(0.75 * width),
			y: Math.floor(-0.4 * height + 0.8 * height * Math.random()),
		});
	}

	return newFishes.map((elt) => {
		elt.x -= (3 + elt.index % 3);

		return elt;
	});
}

function calcCollisions(state) {
	const newProjectiles = state.projectiles.filter((projectile) =>
		state.fishes.filter((fish) =>
			(
				(fish.x >= projectile.x && fish.x <= (projectile.x + TORPEDO_SIZE)) ||
				(projectile.x >= fish.x && projectile.x <= (fish.x + FISH_SIZE))
			) &&
			(
				(fish.y >= projectile.y && fish.y <= (projectile.y + TORPEDO_SIZE)) ||
				(projectile.y >= fish.y && projectile.y <= (fish.y + FISH_SIZE))
			)
		).length === 0
	);

	const newFishes = state.fishes.filter((fish) =>
		state.projectiles.filter((projectile) =>
			(
				(fish.x >= projectile.x && fish.x <= (projectile.x + TORPEDO_SIZE)) ||
				(projectile.x >= fish.x && projectile.x <= (fish.x + FISH_SIZE))
			) &&
			(
				(fish.y >= projectile.y && fish.y <= (projectile.y + TORPEDO_SIZE)) ||
				(projectile.y >= fish.y && projectile.y <= (fish.y + FISH_SIZE))
			)
		).length === 0
	);

	let lost = false;

	// TODO: sound if explode
	// TODO: show explosion

	return [
		newProjectiles,
		newFishes,
		lost,
		state.score + (state.fishes.length - newFishes.length) * FISH_SCORE
	]
}

let lastTorp = Date.now();
const TORP_INTERVAL = 500;
export default function calcGameLoop(width, height, keyboard, state) {
	const newState = {
		submarineY: state.submarineY,
		score: state.score + 0.3,
		lost: false
	};

	// Recalc physic
	newState.projectiles = recalcProjectiles(state.projectiles, width);

	// Fishes
	newState.fishes = recalcFishes(newState.score, state.fishes, width, height);

	// Collisions
	[ newState.projectiles, newState.fishes, newState.lost, newState.score ] = calcCollisions(newState);

	// Keyboard
	newState.submarineY = computeSubmarinePos(height, keyboard, state.submarineY);

	if(keyboard[' '] && (Date.now() - lastTorp) > TORP_INTERVAL) {
		newState.projectiles.push({x: (-width * 0.4) + 80, y: newState.submarineY + 50 });
		lastTorp = Date.now();
	}

	return newState;
}