const SIZE_OF_HEX_IN_PIXELS = 32;
var board;

function start(boardData)
{
	board = JSON.parse(boardData);
	board.NumberOfHexes = board.width * board.height;
	var config = {
	  type: Phaser.AUTO,
	  parent: 'phaser-example',
	  width: board.width * SIZE_OF_HEX_IN_PIXELS,
	  height: board.height *SIZE_OF_HEX_IN_PIXELS,
	  scene: {
		preload: preload,
		create: create,
		update: update
	  }
	};
	 
	var game = new Phaser.Game(config);
}

var hexes = [];
function preload() 
{
	this.load.image('hex', 'Assets/hex.png');
	this.load.image(botColor.BLUE, 'Assets/blueBot.png');
	this.load.image(botColor.RED, 'Assets/redBot.png');
	this.load.image(botColor.YELLOW, 'Assets/yellowBot.png');
	this.load.image(botColor.GREEN, 'Assets/greenBot.png');
	this.load.image('wallV', 'Assets/wallV.png');
	this.load.image('wallH', 'Assets/wallH.png');
}
 
function create() 
{
	//Create Hexes
	let hexCounter = 0;
	for (var i = 0; i < board.width; i++) 
	{
		for (var j = 0; j < board.height; j++) 
		{
			let hex = this.add.image(j *32 , i * 32, 'hex').setOrigin(0, 0).setInteractive();
			hexes.push(hex);
			hexCounter++;
		}
	}

	//Create initial bot positions
	createBot.call(this , board.hexOfBlueBot , 'blueBot');
	createBot.call(this , board.hexOfRedBot , 'redBot');
	createBot.call(this , board.hexOfGreenBot , 'greenBot');
	createBot.call(this , board.hexOfYellowBot , 'yellowBot');

	//Create the walls
	for(const wall of board.walls)
	{
		centerBetweenHexes = getCenterOfHex(wall.h1 , wall.h2);
		let isVertical = wall.h1 + 1 == wall.h2;
		let wallToCreate = isVertical ? 'wallV' : 'wallH';

		let fixY = isVertical ? 0 : 14;
		let fixX = isVertical ? 14 : 0;

		this.add.image((centerBetweenHexes.x * 32)+fixX , (centerBetweenHexes.y * 32)+fixY, wallToCreate).setOrigin(0,0);
	}
}

function moveBotToHex(botType , hexNumber)
{
	switch(botType)
	{
		case botColor.BLUE:
			board.hexOfBlueBot = hexNumber;
			break;
		case botColor.RED:
			board.hexOfRedBot = hexNumber;
			break;
		case botColor.GREEN:
			board.hexOfGreenBot = hexNumber;
			break;
		case botColor.YELLOW:
			board.hexOfYellowBot = hexNumber;
			break;
		default:
			console.log("SHOULD NOT HAPPEN");
	}
	let position = getPositionToPutBotForHex(hexNumber);
	let bot = botTypeToGameObjectMap.get(botType);

	bot.x = (position.x * SIZE_OF_HEX_IN_PIXELS) + 4;
	bot.y = (position.y * SIZE_OF_HEX_IN_PIXELS) +4;
	resetHighlightsAndClickActionsOfHexes();
	setHighlightsAndMoveActionsForNewPosition(botType);
}

function getCenterOfHex(hex)
{
	let width = hex % 16;
	let height = Math.floor(hex / 16);
	let centerOfHex = 
	{
		x : width,
		y : height
	};
	return centerOfHex;
}

function getCenterBetweenHexes(hex1 ,hex2)
{
	let centerBetweenHexes = 
	{
		x : (hex1.x + hex2)/2,
		y : (hex1.y + hex2)/2
	};
	return centerBetweenHexes;
}

var botCurrentlyPointingAt;
var botColorPointingAt;

function resetOnClickOfBoardHexes()
{
	for(const hex of hexes)
	{
		if(hex.input)
		{
			hex.off('pointerdown');
		}
	}
}

var botTypeToGameObjectMap = new Map();

function createBot(hexOfBot , botName)
{
	let position = getPositionToPutBotForHex(hexOfBot);
	let bot = this.add.sprite((position.x * 32) + 4 , (position.y * 32)+4 , botName).setOrigin(0,0).setInteractive();
	botTypeToGameObjectMap.set(botName , bot);

	bot.on('pointerdown' , function(pointer) 
		{
			if(botCurrentlyPointingAt)
			{
				resetHighlightsAndClickActionsOfHexes();
				botCurrentlyPointingAt.setTint(0xffffff);
				if(botCurrentlyPointingAt == this)
				{
					botCurrentlyPointingAt = null;
					return;
				}
			}
			this.setTint(0x00ff00);
			botCurrentlyPointingAt = this;
			this.botType = botName;
			setHighlightsAndMoveActionsForNewPosition(botName);
		});
}

function resetHighlightsAndClickActionsOfHexes()
{
	resetBoardHighlightedHexes();
	resetOnClickOfBoardHexes();
}

function BotMovementDelta(botColor , position)
{
	this.botColor = botColor;
	this.position = position;
}

function undoLastMove()
{
	let delta = deltaMovements.pop();
	if(delta)
	{
		moveBotToHex(delta.botColor , delta.position);
	}
}

var deltaMovements = []
function setHighlightsAndMoveActionsForNewPosition(botType)
{
	let botPosition = getBotPosition(botType);
	let hexesForHighlightLeft = createAvailableMovesForBotOnHexHorizontally(botPosition , -1);
	let hexesForHighlightRight = createAvailableMovesForBotOnHexHorizontally(botPosition , 1);
	let hexesForHighlightDown = createAvailableMovesForBotOnHexVertically(botPosition , 16);
	let hexesForHighlightUp = createAvailableMovesForBotOnHexVertically(botPosition , -16);

	let hexesForHighlight = hexesForHighlightLeft.concat(hexesForHighlightRight).concat(hexesForHighlightDown).concat(hexesForHighlightUp);
	for(hex of hexesForHighlight)
	{
		let numberOfHex = hex;
		hexes[hex].on('pointerdown' , function(pointer) 
			{
				let maxInRow = Math.max(...hexesForHighlightRight);
				let minInRow = Math.min(...hexesForHighlightLeft);
				let maxInColumn = Math.max(...hexesForHighlightDown);
				let minInColumn = Math.min(...hexesForHighlightUp);

				if(getRowOfHex(botPosition) == getRowOfHex(numberOfHex))
				{
					if(botPosition < numberOfHex)
					{
						deltaMovements.push(new BotMovementDelta(botType , botPosition));
						moveBotToHex(botType , maxInRow); //Right movement
					}
					else
					{
						deltaMovements.push(new BotMovementDelta(botType , botPosition));
						moveBotToHex(botType , minInRow); //Left Movement
					}
				}
				else
				{
					if(botPosition < numberOfHex)
					{
						deltaMovements.push(new BotMovementDelta(botType , botPosition));
						moveBotToHex(botType , maxInColumn); //Down movement
					}
					else
					{
						deltaMovements.push(new BotMovementDelta(botType , botPosition));
						moveBotToHex(botType , minInColumn); //Up movement
					}
				}
			});
		hexes[hex].setInteractive();
		hexes[hex].setTint(0x00ffff);
	}
}

function getPositionToPutBotForHex(hex)
{
	let x = hex % 16;
	let y = Math.floor(hex / 16);

	let position = 
	{
		x : x,
		y : y
	};
	return  position;
}

const botColor = {
    BLUE: 'blueBot',
    RED: 'redBot',
    GREEN: 'greenBot',
    YELLOW: 'yellowBot'
}

const dir = {
    LEFT: 'left',
    RIGHT: 'right',
    TOP: 'top',
    BOTTOM: 'bottom'
}

function resetBoardHighlightedHexes()
{
	for(const hex of hexes)
	{
		hex.setTint(0xffffff);
	}
}

function getEligibleMoves(bot , direction)
{
	switch(direction){
		case direction.LEFT:
		case direction.RIGHT:
		case direction.BOT:
		case direction.BOTTOM:
		default:
			console.log("Should not happen");
	}
}

function getBotPosition(botType)
{
	switch(botType)
	{
		case botColor.BLUE:
			return board.hexOfBlueBot;
		case botColor.RED:
			return board.hexOfRedBot;
		case botColor.GREEN:
			return board.hexOfGreenBot;
		case botColor.YELLOW:
			return board.hexOfYellowBot;
		default:
			console.log("SHOULD NOT HAPPEN");
	}
}

function createAvailableMovesForBotOnHexVertically(hex , iterator)
{
	let hexesToHighlight = [];

	if(boardLogic.checkWalls(hex, hex + iterator) || checkBotOnNextHex(hex + iterator)) return hexesToHighlight;

	for(i = hex+iterator; i < board.width * board.height && i >= 0; i+= iterator)
	{
		hexesToHighlight.push(i);
		if(boardLogic.checkWalls(i , i + iterator)|| checkBotOnNextHex(i+iterator))
		{
			break;
		}
	}
	return hexesToHighlight;
}

function createAvailableMovesForBotOnHexHorizontally(hex , iterator)
{
	let rowInfo = getRowInfo(hex);
	let hexesToHighlight = [];

	if(boardLogic.checkWalls(hex, hex + iterator) || checkBotOnNextHex(hex + iterator)) return hexesToHighlight;

	for(i = hex+iterator; i >= rowInfo.leftMostOfRow && i < rowInfo.rightMostOfRow; i+= iterator)
	{
		hexesToHighlight.push(i);
		if(boardLogic.checkWalls(i , i + iterator) || checkBotOnNextHex(i+iterator))
		{
			break;
		}
	}
	return hexesToHighlight;
}

function checkBotOnNextHex(hexToMove)
{
	return (hexToMove == board.hexOfBlueBot 
		|| hexToMove == board.hexOfRedBot
		|| hexToMove == board.hexOfYellowBot
		|| hexToMove == board.hexOfGreenBot);
}

function getRowInfo(hex)
{
	let rowOfHex = getRowOfHex(hex);
	let leftMostOfRow = rowOfHex * board.width;
	let rowInfo = 
		{
			leftMostOfRow : leftMostOfRow,
			rightMostOfRow : leftMostOfRow + board.width
		};
	return rowInfo;
}

function getRowOfHex(hex)
{
	return Math.floor(hex / board.width);
}
 
function update() {}
