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

function computeSubmarinePos(width, height, keyboard, submarineX, submarineY) {
	let newX = 0 + submarineX;
	let newY = 0 + submarineY;
	if(keyboard['ArrowUp']) {
		newY -= 10;
	}
	if(keyboard['ArrowDown']) {
		newY += 10;
	}
	if(keyboard['ArrowLeft']) {
		newX -= 10;
	}
	if(keyboard['ArrowRight']) {
		newX += 10;
	}

	let maxDeltaYPos = 0.45 * height;
	if(newY < -maxDeltaYPos) {
		newY = -maxDeltaYPos;
	} else if(newY > (maxDeltaYPos - 100)) { // 100 = submarine size
		newY = maxDeltaYPos - 100;
	}

	let maxDeltaXPos = 0.45 * width;
	if(newX < -maxDeltaXPos) {
		newX = -maxDeltaXPos;
	} else if(newX > (maxDeltaXPos - 100)) { // 100 = submarine size
		newX = maxDeltaXPos - 100;
	}

	return [newX, newY];
}

function recalcFishes(score, fishes, width, height) {
	const newFishes = fishes.filter((elt) => elt.x > (-0.8 * width) && elt.x < (0.8 * width))

	for(let i = newFishes.length; i < (1 + Math.floor(score / 70)); i++) {
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
	let lost = state.fishes.filter((fish) =>
		(
			(fish.x >= state.submarineX && fish.x <= (state.submarineX + TORPEDO_SIZE)) ||
			(state.submarineX >= fish.x && state.submarineX <= (fish.x + FISH_SIZE))
		) &&
		(
			(fish.y >= state.submarineY && fish.y <= (state.submarineY + TORPEDO_SIZE)) ||
			(state.submarineY >= fish.y && state.submarineY <= (fish.y + FISH_SIZE))
		)
	).length > 0

	let positions = [];
	const newProjectiles = state.projectiles.filter((projectile) => {
		let collisionning = state.fishes.filter((fish) =>
			(
				(fish.x >= projectile.x && fish.x <= (projectile.x + TORPEDO_SIZE)) ||
				(projectile.x >= fish.x && projectile.x <= (fish.x + FISH_SIZE))
			) &&
			(
				(fish.y >= projectile.y && fish.y <= (projectile.y + TORPEDO_SIZE)) ||
				(projectile.y >= fish.y && projectile.y <= (fish.y + FISH_SIZE))
			)
		);

		positions = [...positions, ...collisionning];

		return collisionning.length === 0;
	});

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

	// TODO: sound if explode
	const newExplosions = [...state.explosions];
	for(const position of positions) {
		newExplosions.push({
			x: position.x + FISH_SIZE / 2,
			y: position.y + FISH_SIZE / 2,
			radius: 5,
			index: Math.round(Math.random() * 7),
		})
	}

	return [
		newProjectiles,
		newFishes,
		newExplosions,
		lost || state.lost,
		state.score + (state.fishes.length - newFishes.length) * FISH_SCORE
	]
}

function recalcExplosive(explosions) {
	return explosions.map((explosion) => {
		explosion.radius += 3;
		return explosion;
	}).filter((elt) => elt.radius < 75);
}

let lastTorp = Date.now();
const TORP_INTERVAL = 500;
export default function calcGameLoop(width, height, keyboard, state) {
	if(state.lost) {
		return state;
	}

	const newState = {
		lost: state.lost,
		score: state.score + 0.3,
		submarineX: state.submarineX,
		submarineY: state.submarineY,
	};

	// Recalc physic
	newState.projectiles = recalcProjectiles(state.projectiles, width);

	// Fishes
	newState.fishes = recalcFishes(newState.score, state.fishes, width, height);

	// Keyboard
	[newState.submarineX, newState.submarineY] = computeSubmarinePos(width, height, keyboard, state.submarineX, state.submarineY);

	// Explosves
	newState.explosions = recalcExplosive(state.explosions);

	// Collisions
	[ newState.projectiles, newState.fishes, newState.explosions, newState.lost, newState.score ] = calcCollisions(newState);

	if(keyboard[' '] && (Date.now() - lastTorp) > TORP_INTERVAL) {
		newState.projectiles.push({x: newState.submarineX + 80, y: newState.submarineY + 50 });
		lastTorp = Date.now();
	}

	return newState;
}