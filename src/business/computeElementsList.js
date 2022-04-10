import { CanvasImage, preloadImages } from 'canvas2d-wrapper';

import {
	BG_GROUND_1_SIZE,
	BG_GROUND_2_SIZE,
	BG_GROUND_3_SIZE,
	DIGIT_SIZE,
	FG_GROUND_SIZE,
	FISH_SIZE,
	PLANT_SIZE,
	SUBMARINE_SIZE,
	TORPEDO_SIZE,
} from '../constants/sizes.js';

const BG_GROUND_1_SRC = 'img/bg-sand-1.png';
const BG_GROUND_2_SRC = 'img/bg-sand-2.png';
const BG_GROUND_3_SRC = 'img/bg-sand-3.png';
const DIGIT_SRC = (i) => `img/numbers/${i}.png`;
const EXPLOSIVE_SRC = (i) => `img/explosion/${i}.png`;
const FG_GROUND_SRC = 'img/fg-sand.png';
const FISH_SRC = (i) => `img/fish/${i}.png`;
const PLANT_SRC = (i) => `img/plants/${i}.png`;
const SUBMARINE_SRC = 'img/submarine.png';
const TORPEDO_SRC = 'img/torpedo.png';

preloadImages([
	BG_GROUND_1_SRC,
	BG_GROUND_2_SRC,
	BG_GROUND_3_SRC,
	...Array.from({ length: 10}, (_, i) => DIGIT_SRC(i)),
	...Array.from({ length: 8}, (_, i) => EXPLOSIVE_SRC(i)),
	FG_GROUND_SRC,
	...Array.from({ length: 12}, (_, i) => FISH_SRC(i)),
	...Array.from({ length: 24}, (_, i) => PLANT_SRC(i + 1)),
	SUBMARINE_SRC,
	TORPEDO_SRC,
]);

function computeScoreTiles(width, height, score) {
	const scoreTiles = [];
	const digits = Math.floor(score).toString().split('');
	for(let i = digits.length - 1; i >= 0; i--) {
		scoreTiles.push(
			new CanvasImage({
				id: `digit-${i}`,
				x: width / 2 - 25 - (digits.length - i) * 45,
				y: -height / 2,
				width: DIGIT_SIZE,
				height: DIGIT_SIZE,
				zIndex: 15,
				draggable: false,
				src: DIGIT_SRC(digits[i])
			})
		);
	}


	return scoreTiles;
}

function getPlantPos(width, i) {
	if(!width) {
		return 0;
	}

	let space =  Math.ceil(Math.abs(
		0.05 * Math.pow((-1 * i), 3) + 0.1 * Math.pow((-1 * i), 2) + 10 * i + 100
	));

	let amount = Math.ceil(width / space) * 1.5;

	return -((Date.now() / 25) % (amount * space)) + width/2;
}

export default function computeElementsList(width, height, state) {
	return [
		// SUBMARINE
		new CanvasImage({
			id: 'submarine',
			x: state.submarineX,
			y: state.submarineY,
			width: SUBMARINE_SIZE,
			height: SUBMARINE_SIZE,
			zIndex: 100,
			draggable: false,
			src: SUBMARINE_SRC
		}),

		// TORPEDOES
		...state.projectiles.map((elt, i) =>
			new CanvasImage({
				id: `torp-${i}`,
				x: elt.x,
				y: elt.y,
				width: TORPEDO_SIZE,
				height: TORPEDO_SIZE,
				zIndex: 101,
				draggable: false,
				src: TORPEDO_SRC
			})
		),

		// EXPLOSIONS
		...state.explosions.map((elt, i) =>
			new CanvasImage({
				id: `explosion-${i}`,
				x: elt.x - elt.radius/2,
				y: elt.y - elt.radius/2,
				width: elt.radius,
				height: elt.radius,
				zIndex: 102,
				draggable: false,
				src: EXPLOSIVE_SRC(elt.index)
			})
		),

		// GROUND & PLANTS
		...Array.from({length: Math.ceil(width/FG_GROUND_SIZE) * 2}, (elt, i) =>
			new CanvasImage({
				id: `fg-ground-${i}`,
				x: (-0.5 * width) + FG_GROUND_SIZE * i - ((Date.now() / 25) % FG_GROUND_SIZE),
				y: height / 2 - FG_GROUND_SIZE,
				width: FG_GROUND_SIZE,
				height: FG_GROUND_SIZE,
				zIndex: 15,
				draggable: false,
				src: FG_GROUND_SRC
			})
		),
		...Array.from({length: Math.ceil(width/PLANT_SIZE)}, (elt, i) =>
			new CanvasImage({
				id: `plant-${i}`,
				x: getPlantPos(width, i),
				y: height / 2 - PLANT_SIZE - FG_GROUND_SIZE + 5,
				width: PLANT_SIZE,
				height: PLANT_SIZE,
				zIndex: 14,
				draggable: false,
				src: PLANT_SRC((i%24) + 1)
			})
		),

		// FISHES
		...state.fishes.map((elt, i) =>
			new CanvasImage({
				id: `fish-${elt.index}`,
				x: elt.x,
				y: elt.y,
				width: FISH_SIZE,
				height: FISH_SIZE,
				zIndex: 100,
				draggable: false,
				src: FISH_SRC(elt.index%12)
			})
		),

		// BACKGROUND #1 - SAND
		...Array.from({length: Math.ceil(width/BG_GROUND_1_SIZE) * 2}, (elt, i) =>
			new CanvasImage({
				id: `bg-ground-1-${i}`,
				x: (-0.5 * width) + BG_GROUND_1_SIZE * i - ((Date.now() / 30) % BG_GROUND_1_SIZE),
				y: height / 2 - BG_GROUND_1_SIZE + 25,
				width: BG_GROUND_1_SIZE,
				height: BG_GROUND_1_SIZE,
				zIndex: 12,
				draggable: false,
				src: BG_GROUND_1_SRC
			})
		),
		...Array.from({length: Math.ceil(width/BG_GROUND_2_SIZE) * 2}, (elt, i) =>
			new CanvasImage({
				id: `bg-ground-2-${i}`,
				x: (-0.5 * width) + BG_GROUND_2_SIZE * i - ((Date.now() / 35) % BG_GROUND_2_SIZE) + 13,
				y: height / 2 - BG_GROUND_2_SIZE + 25,
				width: BG_GROUND_2_SIZE,
				height: BG_GROUND_2_SIZE,
				zIndex: 11,
				draggable: false,
				src: BG_GROUND_2_SRC
			})
		),
		...Array.from({length: Math.ceil(width/BG_GROUND_3_SIZE) * 2}, (elt, i) =>
			new CanvasImage({
				id: `bg-ground-3-${i}`,
				x: (-0.5 * width) + BG_GROUND_3_SIZE * i - ((Date.now() / 40) % BG_GROUND_3_SIZE) + 7,
				y: height / 2 - BG_GROUND_3_SIZE + 20,
				width: BG_GROUND_3_SIZE,
				height: BG_GROUND_3_SIZE,
				zIndex: 10,
				draggable: false,
				src: BG_GROUND_3_SRC
			})
		),

		// SCORE
		...computeScoreTiles(width, height, state.score)
	];
}