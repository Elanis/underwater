import {
	FISH_SIZE,
	FISH_MAX_SIZE,
	SUBMARINE_SIZE,
	TORPEDO_SIZE,
} from '../constants/sizes.js';

const FISH_SCORE = 100;

function recalcProjectiles(projectiles, width) {
	return projectiles.map((elt) => {
				elt.x += 5;
				return elt;
	}).filter((elt) => elt.x < width * 1.5);
}

function computeSubmarinePos(width, height, keyboard, gamepad, submarineX, submarineY) {
	let newX = 0 + submarineX;
	let newY = 0 + submarineY;
	if(keyboard['ArrowUp']) {
		newY -= 10;
	}
	if(keyboard['ArrowDown']) {
		newY += 10;
	}
	if(keyboard['ArrowLeft']) {
		newX -= 5;
	}
	if(keyboard['ArrowRight']) {
		newX += 5;
	}

	try {
		if(gamepad) {
			const upDownAxis = gamepad.axes[1];
			const leftRightAxis = gamepad.axes[0];

			if(upDownAxis < -0.5) {
				newY -= 10;
			}
			if(upDownAxis > 0.5) {
				newY += 10;
			}
			if(leftRightAxis < -0.5) {
				newX -= 10;
			}
			if(leftRightAxis > 0.5) {
				newX += 10;
			}
		}
	} catch(e) {
		console.error(e);
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
		elt.x -= (elt.index % 3);

		return elt;
	});
}

function calcCollisions(state) {
	let lost = state.fishes.filter((fish) =>
		(
			(fish.x >= state.submarineX && fish.x <= (state.submarineX + SUBMARINE_SIZE)) ||
			(state.submarineX >= fish.x && state.submarineX <= (fish.x + ((FISH_MAX_SIZE - FISH_SIZE[fish.index%10].x) / 2) +  FISH_SIZE[fish.index%10].x))
		) &&
		(
			(fish.y >= state.submarineY && fish.y <= (state.submarineY + SUBMARINE_SIZE)) ||
			(state.submarineY >= fish.y && state.submarineY <= (fish.y + ((FISH_MAX_SIZE - FISH_SIZE[fish.index%10].y) / 2) + FISH_SIZE[fish.index%10].y))
		)
	).length > 0

	let positions = [];
	const newProjectiles = state.projectiles.filter((projectile) => {
		let collisionning = state.fishes.filter((fish) =>
			(
				(fish.x >= projectile.x && fish.x <= (projectile.x + TORPEDO_SIZE)) ||
				(projectile.x >= fish.x && projectile.x <= (fish.x + ((FISH_MAX_SIZE - FISH_SIZE[fish.index%10].x) / 2) + FISH_SIZE[fish.index%10].x))
			) &&
			(
				(fish.y >= projectile.y && fish.y <= (projectile.y + TORPEDO_SIZE)) ||
				(projectile.y >= fish.y && projectile.y <= (fish.y + ((FISH_MAX_SIZE - FISH_SIZE[fish.index%10].y) / 2) + FISH_SIZE[fish.index%10].y))
			)
		);

		positions = [...positions, ...collisionning];

		return collisionning.length === 0;
	});

	const newFishes = state.fishes.filter((fish) =>
		state.projectiles.filter((projectile) =>
			(
				(fish.x >= projectile.x && fish.x <= (projectile.x + TORPEDO_SIZE)) ||
				(projectile.x >= fish.x && projectile.x <= (fish.x + ((FISH_MAX_SIZE - FISH_SIZE[fish.index%10].x) / 2) + FISH_SIZE[fish.index%10].x))
			) &&
			(
				(fish.y >= projectile.y && fish.y <= (projectile.y + TORPEDO_SIZE)) ||
				(projectile.y >= fish.y && projectile.y <= (fish.y + ((FISH_MAX_SIZE - FISH_SIZE[fish.index%10].y) / 2) + FISH_SIZE[fish.index%10].y))
			)
		).length === 0
	);

	const newExplosions = [...state.explosions];
	for(const position of positions) {
		const sound = new Audio();
		sound.volume = 0.1;
		sound.src = './snd/268557__cydon__explosion-001.mp3';
		sound.play();

		newExplosions.push({
			x: position.x + FISH_MAX_SIZE / 2,
			y: position.y + FISH_MAX_SIZE / 2,
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

const TORP_INTERVAL = 250;
let lastTorp = Date.now() - TORP_INTERVAL;
export default function calcGameLoop(width, height, keyboard, gamepad, state) {
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
	[newState.submarineX, newState.submarineY] = computeSubmarinePos(width, height, keyboard, gamepad, state.submarineX, state.submarineY);

	// Explosves
	newState.explosions = recalcExplosive(state.explosions);

	// Collisions
	[ newState.projectiles, newState.fishes, newState.explosions, newState.lost, newState.score ] = calcCollisions(newState);

	if(
		(keyboard[' '] || (gamepad && gamepad.buttons[3].pressed) || (gamepad && gamepad.buttons[2].pressed))
			&& (Date.now() - lastTorp) > TORP_INTERVAL) {
		newState.projectiles.push({x: newState.submarineX + 80, y: newState.submarineY + 50 });
		lastTorp = Date.now();
	}

	return newState;
}