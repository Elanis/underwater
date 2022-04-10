import { CanvasImage, preloadImages } from 'canvas2d-wrapper';

const BG_GROUND_1_SRC = 'img/bg-sand-1.png';
const BG_GROUND_2_SRC = 'img/bg-sand-2.png';
const BG_GROUND_3_SRC = 'img/bg-sand-3.png';
const DIGIT_SRC = (i) => `img/numbers/${i}.png`;
const FG_GROUND_SRC = 'img/fg-sand.png';
const PLANT_SRC = (i) => `img/plants/${i}.png`;
const SUBMARINE_SRC = 'img/submarine.png';
const TORPEDO_SRC = 'img/torpedo.png';

preloadImages([
	BG_GROUND_1_SRC,
	BG_GROUND_2_SRC,
	BG_GROUND_3_SRC,
	...Array.from({ length: 10}, (_, i) => DIGIT_SRC(i)),
	FG_GROUND_SRC,
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
				width: 45,
				height: 45,
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
			x: -width * 0.4,
			y: state.submarineY,
			width: 75,
			height: 75,
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
				width: 25,
				height: 25,
				zIndex: 101,
				draggable: false,
				src: TORPEDO_SRC
			})
		),

		// GROUND & PLANTS
		...Array.from({length: Math.ceil(width/50) * 2}, (elt, i) =>
			new CanvasImage({
				id: `fg-ground-${i}`,
				x: (-0.5 * width) + 50 * i - ((Date.now() / 25) % 50),
				y: height / 2 - 50,
				width: 50,
				height: 50,
				zIndex: 15,
				draggable: false,
				src: FG_GROUND_SRC
			})
		),
		...Array.from({length: Math.ceil(width/50)}, (elt, i) =>
			new CanvasImage({
				id: `plant-${i}`,
				x: getPlantPos(width, i),
				y: height / 2 - 50 - 45,
				width: 50,
				height: 50,
				zIndex: 14,
				draggable: false,
				src: PLANT_SRC((i%24) + 1)
			})
		),

		// BACKGROUND #1 - SAND
		...Array.from({length: Math.ceil(width/100) * 2}, (elt, i) =>
			new CanvasImage({
				id: `bg-ground-1-${i}`,
				x: (-0.5 * width) + 100 * i - ((Date.now() / 25) % 100),
				y: height / 2 - 75,
				width: 100,
				height: 100,
				zIndex: 12,
				draggable: false,
				src: BG_GROUND_1_SRC
			})
		),
		...Array.from({length: Math.ceil(width/125) * 2}, (elt, i) =>
			new CanvasImage({
				id: `bg-ground-2-${i}`,
				x: (-0.5 * width) + 125 * i - ((Date.now() / 25) % 125) + 13,
				y: height / 2 - 100,
				width: 125,
				height: 125,
				zIndex: 11,
				draggable: false,
				src: BG_GROUND_2_SRC
			})
		),
		...Array.from({length: Math.ceil(width/150) * 2}, (elt, i) =>
			new CanvasImage({
				id: `bg-ground-3-${i}`,
				x: (-0.5 * width) + 150 * i - ((Date.now() / 25) % 150) + 7,
				y: height / 2 - 130,
				width: 150,
				height: 150,
				zIndex: 10,
				draggable: false,
				src: BG_GROUND_3_SRC
			})
		),

		// SCORE
		...computeScoreTiles(width, height, state.score)
	];
}