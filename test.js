const Source = require('./game.js');
const TicTacToe = Source.ticTacToe;
const TicTacToeREPL = Source.ticTacToeREPL

describe("TicTacToe", () => {

	let game;

	beforeEach(() => {
		game = new TicTacToe({
			boardLength: 3,
			isComputerPlaying: false
		});
	});

	test("TicTacToe class can be instantiated", () => {
		let gameInstance = new TicTacToe({
			boardLength: 3,
			isComputerPlaying: false
		});
		expect(gameInstance).toBeTruthy();
	});
	test("TicTacToe class is instantiated with correct attributes", () => {

		expect(game.currentPlayer).toBe(1);
		expect(game.boardLength).toBe(3);
		expect(game.boardArray.length).toBe(9);
		expect(game.remainingMoves.length).toBe(9);
		expect(game.gameOver).toBeFalsy();
		expect(game.computerPlayer).toBeFalsy();

		for (let i = 0; i < game.boardArray.length; i++) {
			expect(game.boardArray[i]).toBe(0);
			expect(game.remainingMoves[i]).toBe(i);
		}
	});
	test("#checkWin should call directional win condition methods", () => {

		let boardArray = [0,0,0,0,0,0,0,0,0];

		game.checkHorizontalWin = jest.fn((board) => {
			expect(board).toMatchObject(boardArray);
		});
		game.checkVerticalWin = jest.fn((board) => {
			expect(board).toMatchObject(boardArray);
		});
		game.checkDiagonalWin = jest.fn((board) => {
			expect(board).toMatchObject(boardArray);
		});

		expect(game.checkWin(boardArray)).toBeFalsy();
		expect(game.checkHorizontalWin).toBeCalled();
		expect(game.checkVerticalWin).toBeCalled();
		expect(game.checkDiagonalWin).toBeCalled();
	});
	test("#checkWin should return the winning player if a player has won", () => {

		let boardArray = [1,1,1,0,0,0,0,0,0];

		expect(game.checkWin(boardArray)).toBeTruthy();
		expect(game.checkWin(boardArray)).toBe(1);

	});	
	test("#checkHorizontalWin should identify a horizontal victory", () => {

		let boardArray = [0,0,0,0,0,0,0,0,0];
		expect(game.checkHorizontalWin(boardArray)).toBeFalsy();

		boardArray = [1,1,0,0,0,0,-1,-1,0];
		expect(game.checkHorizontalWin(boardArray)).toBeFalsy();

		boardArray = [1,1,1,0,0,0,-1,-1,0];

		expect(game.checkHorizontalWin(boardArray)).toBeTruthy();
		expect(game.checkHorizontalWin(boardArray)).toBe(1);

		boardArray = [1,1,0,-1,-1,-1,0,0,0];

		expect(game.checkHorizontalWin(boardArray)).toBeTruthy();
		expect(game.checkHorizontalWin(boardArray)).toBe(-1);
	});
	test("#checkVerticalWin should identify a vertical victory", () => {

		let boardArray = [0,0,0,0,0,0,0,0,0];
		expect(game.checkVerticalWin(boardArray)).toBeFalsy();

		boardArray = [1,1,0,0,0,0,-1,-1,0];
		expect(game.checkVerticalWin(boardArray)).toBeFalsy();

		boardArray = [1,0,-1,1,0,-1,1,0,0];

		expect(game.checkVerticalWin(boardArray)).toBeTruthy();
		expect(game.checkVerticalWin(boardArray)).toBe(1);

		boardArray = [1,-1,0,0,-1,1,0,-1,0];

		expect(game.checkVerticalWin(boardArray)).toBeTruthy();
		expect(game.checkVerticalWin(boardArray)).toBe(-1);
	});
	test("#checkDiagonalWin should identify a diagonal victory", () => {

		let boardArray = [0,0,0,0,0,0,0,0,0];
		expect(game.checkDiagonalWin(boardArray)).toBeFalsy();

		boardArray = [1,1,0,0,0,0,-1,-1,0];
		expect(game.checkDiagonalWin(boardArray)).toBeFalsy();

		boardArray = [1,0,-1,1,-1,0,-1,0,0];

		expect(game.checkDiagonalWin(boardArray)).toBeTruthy();
		expect(game.checkDiagonalWin(boardArray)).toBe(-1);

		boardArray = [1,-1,0,0,1,-1,0,-1,1];

		expect(game.checkDiagonalWin(boardArray)).toBeTruthy();
		expect(game.checkDiagonalWin(boardArray)).toBe(1);
	});
	test("#drawBoard should draw the board as expected", () => {

		console.clear = jest.fn();
		console.log = jest.fn();

		game.drawBoard();

		expect(console.log).toBeCalled();
		expect(console.log.mock.calls[0][0]).toMatch("| 0 | 1 | 2 |\n| 3 | 4 | 5 |\n| 6 | 7 | 8 |\n");

		game.boardArray = [1, 1, 0, -1, -1, 0, 1, 0, -1];

		game.drawBoard();

		expect(console.log).toBeCalled();
		expect(console.log.mock.calls[1][0]).toMatch("| x | x | 2 |\n| o | o | 5 |\n| x | 7 | o |\n");
	});
	test("#validateMove should reject non-numerical moves and numeric moves that have already been played)", () => {

		expect(game.validateMove(9)).toBeFalsy();
		expect(game.validateMove('a')).toBeFalsy();
		expect(game.validateMove('1')).toBeFalsy();
		expect(game.validateMove([1])).toBeFalsy();
		expect(game.validateMove({1: 1})).toBeFalsy();

		expect(game.validateMove(1)).toBeTruthy();

		game.boardArray[1] = 1;
		game.remainingMoves.splice(game.remainingMoves.indexOf(1), 1);

		expect(game.validateMove(1)).toBeFalsy();
	});
	test("#submitMove should update game.boardArray and game.remainingMoves", () => {

		expect(game.boardArray).toMatchObject([0,0,0,0,0,0,0,0,0]);
		expect(game.remainingMoves.length).toBe(9);

		game.submitMove(1);

		expect(game.boardArray).toMatchObject([0,1,0,0,0,0,0,0,0])
		expect(game.remainingMoves.length).toBe(8);
		expect(game.remainingMoves).not.toContain(1);


	});
});

describe("TicTacToeREPL", () => {

	beforeEach(() => {
		game = new TicTacToe({
			boardLength: 3,
			isComputerPlaying: false
		});
	});

	test("REPL can be instantiated with a new TicTacToe game", () => {
		let repl = new TicTacToeREPL(game);
		repl.closeREPL();
	});
	test("#enterMove will prompt player for move and resolve to the value of the move", () => {
		let repl = new TicTacToeREPL(game);
		repl.readLine.question = jest.fn(() => {
			return 3;
		});

		let move = repl.enterMove();
		expect(repl.readLine.question.mock.calls[0][0]).toMatch("Enter the number of the square where you would like to play: ");

		repl.closeREPL();
	});
	test("#closeREPL will draw board, announce winner, and close the readline input/output stream", () => {
		game.drawBoard = jest.fn();
		console.log = jest.fn();

		let repl = new TicTacToeREPL(game);
		repl.closeREPL();

		expect(game.drawBoard).toBeCalled();
		expect(console.log.mock.calls[0][0]).toMatch("It's a tie!");

		repl = new TicTacToeREPL(game);
		game.winner = 1;
		repl.closeREPL();

		expect(console.log.mock.calls[1][0]).toMatch("E(x)cellent! Congratulations player one!");

		repl = new TicTacToeREPL(game);
		game.winner = -1;
		repl.closeREPL();

		expect(game.drawBoard).toBeCalled();
		expect(console.log.mock.calls[2][0]).toMatch("(o)mg! Congratulations player two!");
	});

});