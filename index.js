class Turn {
    static #turn = true;

    static next() {
        let previous = this.#turn;
        this.#turn = !this.#turn;
        return previous;
    }
}

class Cell {
    constructor() {
        this.value = "";
    }
}

class Row {
    constructor() {
        this.cells = [new Cell(), new Cell(), new Cell()];
    }
}

class Board {
    constructor() {
        this.rows = [new Row(), new Row(), new Row()];
    }
    getCellValue(index) {
        const row = Math.floor(index / 3);
        const col = index % 3;
        return this.rows[row].cells[col].value;
    }
}

class Game {
    constructor() {
        this.board = new Board();
        this.gameOver = false;
    }
    checkWin() {
        const winning = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const [a, b, c] of winning) {
            const va = this.board.getCellValue(a);
            const vb = this.board.getCellValue(b);
            const vc = this.board.getCellValue(c);

            if (va && va === vb && va === vc) {
                this.gameOver = true;
                return va;
            }
        }

        return null;
    }
}

class Renderer {
    constructor(game, boardElementId, statusElementId) {
        this.game = game;
        this.boardElement = document.getElementById(boardElementId);
        this.statusElement = document.getElementById(statusElementId);
    }

    renderBoard() {
        this.boardElement.innerHTML = "";
        let table = this.#createBoard(this.game.board);
        this.boardElement.appendChild(table);
    }
    renderStatus() {
        const winner = this.game.checkWin();
        if (winner) {
            this.statusElement.innerText = `Winner: ${winner}`;
        }
    }

    #createCell(cell) {
        let td = document.createElement("td");
        td.innerText = cell.value;

        td.onclick = () => {
            if (this.game.gameOver) return;
            if (cell.value) return;

            let symbol = Turn.next() ? "X" : "O";
            cell.value = symbol;
            td.innerText = symbol;
        };

        return td;
    }
    #createRow(row) {
        let tr = document.createElement("tr");
        for (const cell of row.cells) {
            let td = this.#createCell(cell);
            tr.appendChild(td);
        }
        return tr;
    }
    #createBoard(board) {
        let table = document.createElement("table");
        for (const row of board.rows) {
            let tr = this.#createRow(row);
            table.appendChild(tr);
        }
        return table;
    }
}

const game = new Game();
const renderer = new Renderer(game, "board", "status");

window.onload = () => {
    renderer.renderBoard();
};

window.onclick = () => {
    renderer.renderStatus();
}