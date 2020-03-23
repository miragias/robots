function WallBetweenHexes(h1,h2)
{
	this.h1 = h1;
	this.h2 = h2;
}

const wallsOnMap = [
	//Horizontal walls
	new WallBetweenHexes(5,6),
	new WallBetweenHexes(8,9),
	new WallBetweenHexes(25,26),
	new WallBetweenHexes(44,45),
	new WallBetweenHexes(48,49),
	new WallBetweenHexes(59,60),
	new WallBetweenHexes(70,71),
	new WallBetweenHexes(87,88),
	new WallBetweenHexes(98,99),
	new WallBetweenHexes(109,110),
	new WallBetweenHexes(118,119),
	new WallBetweenHexes(120,121),
	new WallBetweenHexes(134,135),
	new WallBetweenHexes(136,137),
	new WallBetweenHexes(145,146),
	new WallBetweenHexes(154,155),
	new WallBetweenHexes(162,163),
	new WallBetweenHexes(182,183),
	new WallBetweenHexes(188,189),
	new WallBetweenHexes(216,217),
	new WallBetweenHexes(229,230),
	new WallBetweenHexes(246,247),
	new WallBetweenHexes(250,251),
	//Vertical walls
	new WallBetweenHexes(26 , 26+16),
	new WallBetweenHexes(33 , 33 + 16),
	new WallBetweenHexes(44 , 44 + 16),
	new WallBetweenHexes(70 , 70 + 16),
	new WallBetweenHexes(79 , 79 + 16),
	new WallBetweenHexes(80, 80 + 16),
	new WallBetweenHexes(82, 82 + 16),
	new WallBetweenHexes(88, 88 + 16),
	new WallBetweenHexes(93, 93 + 16),
	new WallBetweenHexes(99, 99 + 16),
	new WallBetweenHexes(146, 146 + 16),
	new WallBetweenHexes(154, 154 + 16),
	new WallBetweenHexes(167, 167 + 16),
	new WallBetweenHexes(172, 172 + 16),
	new WallBetweenHexes(189, 189 + 16),
	new WallBetweenHexes(192, 192 + 16),
	new WallBetweenHexes(201, 201 + 16),
	new WallBetweenHexes(207, 207 + 16),
	new WallBetweenHexes(229, 229 + 16),
	new WallBetweenHexes(103, 103 + 16),
	new WallBetweenHexes(104, 104 + 16),
	new WallBetweenHexes(135, 135 + 16),
	new WallBetweenHexes(136, 136 + 16),
];

const BOARD_WIDTH = 16;
const BOARD_HEIGHT = 16;
const BOARD_HEXES = BOARD_WIDTH * BOARD_HEIGHT;

const boardInitData = 
{
	width : BOARD_WIDTH ,
	height : BOARD_HEIGHT ,
	hexOfBlueBot : 171,
	hexOfRedBot : 243,
	hexOfGreenBot : 113,
	hexOfYellowBot : 21,
	walls: wallsOnMap
};

(function(exports){

	exports.checkWalls = function checkWallExistsBetweenHexes(h1 , h2)
	{
		for (const wall of boardInitData.walls) 
		{
			if ((wall.h1 == h1 && wall.h2 == h2 ) || (wall.h1 == h2 && wall.h2 == h1))
			{
				return true;
			}
		}
		return false;
	},

	exports.createWallBetween = function createWallBetween(h1 ,h2)
	{
		return new WallBetweenHexes(h1,h2);
	},

	exports.createBoard = function createBoard()
	{
		return JSON.stringify(boardInitData);
	}

})(typeof exports === 'undefined'? this['boardLogic']={}: exports);
