/*  
	Tic Tac Toe Game

 	Build a Tic Tac Toe game where two humans can play a game in the terminal
 	Game should report the outcome of the game

 	TODO: Add support for computer player.
 	TODO: Add 'easy' mode for computer player where moves are random
 	TODO: Add 'medium' mode for computer player where computer will play a 
 	winning move this turn if a winning move is available
 	TODO: Add 'hard' mode for computer player where computer recursively explores 
 	all possible move paths and chooses best option (something like https://www.neverstopbuilding.com/blog/minimax)

 	BOARD
 	Board is represented as an array (boardArray) with length n x n where n is one dimension of the square board. The 3x3 board is considered here.

 	3x3 board (numbers shown are array indices)
 	 0 | 1 | 2 
 	 3 | 4 | 5
 	 6 | 7 | 8

 	boardArray: [0,0,0,0,0,0,0,0,0]

 	Player one moves are repesented by 1.
 	Player two moves are represented by -1.

 	Ex: Player one moves at space 0 (upper left)
 	x | 1 | 2
 	3 | 4 | 5
 	6 | 7 | 8

 	boardArray: [1,0,0,0,0,0,0,0,0]

 	Ex: Player two moves at space 4 (middle)
 	x | 1 | 2
 	3 | o | 5
 	6 | 7 | 8

 	boardArray: [1,0,0,0,-1,0,0,0,0]
*/

const readline = require('readline');

class TicTacToeREPL {

	constructor(game) {

		this.game = game;
		this.readLine = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
	}
	async loop() {

		let game = this.game;
		game.drawBoard();

		while(!game.gameOver) {

			let move = await this.enterMove();
			move = parseInt(move, 10);

			let valid = game.validateMove(move);

			if(!valid) {
				game.drawBoard();
				console.log('Invalid move' + '\n');
				continue;
			}

			game.submitMove(move);

			let winner = game.checkWin(game.boardArray);
			if(winner || game.remainingMoves.length === 0) {
				game.gameOver = true;
				game.winner = winner;
				break;
			}

			game.drawBoard();
			game.currentPlayer = -game.currentPlayer;
			//TODO: Let computer player take turn here if computer player is on
		}

		this.closeREPL();
	}
	async enterMove() {
		return new Promise((res) => {
			this.readLine.question("Enter the number of the square where you would like to play: ", (move) => {
				res(move);
			});
		});
	}
	closeREPL() {
		this.game.drawBoard();
		if(!this.game.winner) {console.log("It's a tie!");}
		if(this.game.winner === 1) {console.log("E(x)cellent! Congratulations player one!");}
		if(this.game.winner === -1) {console.log("(o)mg! Congratulations player two!");}
		this.readLine.close();
	}
}

class TicTacToe {

	constructor({ boardLength, isComputerPlaying }) {
		// x player is 1
		// o player is -1

		this.currentPlayer = 1;
		this.computerPlayer = isComputerPlaying ? -1 : false;

		this.boardLength = boardLength;
		this.boardArray = new Array(boardLength * boardLength);
		this.remainingMoves = [];

		for(let i = 0; i < boardLength * boardLength; i++) {
			this.boardArray[i] = 0;
			this.remainingMoves.push(i);
		}

		this.gameOver = false;
		this.winner = false;
	}
	validateMove(spaceNumber) {
		if(typeof spaceNumber !== 'number') {
			return false;
		}
		let valid = this.remainingMoves.filter((move) => {
			return spaceNumber === move;
		});

		if(valid.length === 0) {
			return false;
		}

		return true;
	}
	submitMove(spaceNumber) {

		let index = this.remainingMoves.indexOf(spaceNumber);
		this.remainingMoves.splice(index, 1);

		this.boardArray[spaceNumber] = this.currentPlayer;
	}
	drawBoard() {

		let str = "";

		let counter = 0;
		let row = 1;
		let endRow = this.boardLength;

		while(row <= endRow) {

			str += "|";

			while(counter < row * this.boardLength) {

				switch(this.boardArray[counter]) {
					case 0:
						str += " " + counter + " |";
						break;
					case 1: 
						str += " x |";
						break;
					case -1:
						str += " o |";
						break;
				}
				counter++;
			}

			str += "\n";
			row++;
		}

		console.clear();
		console.log(str);
	}
	checkWin(boardArray) {
		let winner;

		winner = this.checkHorizontalWin(boardArray);
		if(winner) {return winner;}

		winner = this.checkVerticalWin(boardArray);
		if(winner) {return winner;}

		winner = this.checkDiagonalWin(boardArray);
		if(winner) {return winner;}
	}
	checkHorizontalWin(boardArray) {
		let counter = 0;
		let sum = 0;

		let row = 1;
		let endRow = this.boardLength;

		while(row <= endRow) {

			sum = 0;

			while(counter < row * this.boardLength) {
				sum += boardArray[counter];
				counter++;
			}

			if(sum === this.boardLength) {
				return 1;
			}
			if (sum === -this.boardLength) {
				return -1;
			}

			row++;
		}

		return false;
	}
	checkVerticalWin(boardArray) {
		let counter = 0;
		let sum = 0;

		let column = 0;
		let endColumn = this.boardLength;

		//Find sum of all vertical rows
		while(column < endColumn) {

			sum = 0;
			counter = column;

			while(counter < boardArray.length) {
				sum += boardArray[counter];
				counter += this.boardLength;
			}

			if(sum === this.boardLength) {
				return 1;
			}
			if (sum === -this.boardLength) {
				return -1;
			}

			column++;
		}

		return false;
	}
	checkDiagonalWin(boardArray) {
		let sum = 0;

		//Find sum of upper-left to lower-right diagonal
		for(let i = 0; i < boardArray.length; i = i + this.boardLength + 1) {
			sum += boardArray[i];
		}
		if(sum === this.boardLength) {
			return 1;
		}
		if (sum === -this.boardLength) {
			return -1;
		}

		sum = 0;

		//Find sum of lower-left to upper-right diagonal
		for(let i = this.boardLength - 1; i <= boardArray.length - this.boardLength; i = i + this.boardLength - 1) {
			sum += boardArray[i];
		}
		if(sum === this.boardLength) {
			return 1;
		}
		if (sum === -this.boardLength) {
			return -1;
		}

		return false;
	}
}


async function main() {

	let rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question("Want to play Tic Tac Toe??!? Please enter a board length: ", async (num) => {
		rl.question("Is the computer playing??! (y/n): ", async (response) => {

			rl.close();

			num = parseInt(num, 10);

			//num !== num checks if num is NaN
			if(
				num !== num 		||
				response !== 'y'	&& 
				response !== 'n'
			) 
			{
				console.log('Enter a number for board length and y/n for computer playing.');
				rl.close();
				return;
			}

			let game = new TicTacToe({
				boardLength: num,
				isComputerPlaying: false
			});

			let repl = new TicTacToeREPL(game);
			await repl.loop();
		});
	});
}

main();

module.exports = {
	ticTacToe: TicTacToe,
	ticTacToeREPL: TicTacToeREPL
}