export const BG_GROUND_1_SIZE = 100;
export const BG_GROUND_2_SIZE = 125;
export const BG_GROUND_3_SIZE = 150;
export const DIGIT_SIZE = 45;
export const FG_GROUND_SIZE = 50;
export const FISH_MAX_SIZE = 50;
export const PLANT_SIZE = 50;
export const SUBMARINE_SIZE = 100;
export const TORPEDO_SIZE = 30;
export const FISH_SIZE = [
	{
		x: 113,
		y: 88
	},
	{
		x: 115,
		y: 115
	},
	{
		x: 109,
		y: 75
	},
	{
		x: 120,
		y: 72
	},
	{
		x: 80,
		y: 48
	},
	{
		x: 115,
		y: 115
	},
	{
		x: 109,
		y: 75
	},
	{
		x: 120,
		y: 72
	},
	{
		x: 113,
		y: 88
	},
	{
		x: 115,
		y: 65
	}
].map((elt) => {
	elt.x = Math.floor(elt.x / 128 * FISH_MAX_SIZE);
	elt.y = Math.floor(elt.y / 128 * FISH_MAX_SIZE);

	return elt;
});