const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    this.field = field;
    this.width = field[0].length;
    this.height = field.length;
    this.row = 0;
    this.col = 0;
  }

  print() {
    console.log(this.field.map((arr) => arr.join("")).join("\n"));
  }

  move(direction) {
    let possiblePosition;
    switch (direction) {
      case "r":
        possiblePosition = { row: this.row, col: this.col + 1 };
        break;
      case "l":
        possiblePosition = { row: this.row, col: this.col - 1 };
        break;
      case "u":
        possiblePosition = { row: this.row - 1, col: this.col };
        break;
      case "d":
        possiblePosition = { row: this.row + 1, col: this.col };
        break;
    }
    let returnedCharacter = this.getPositionValue(possiblePosition);
    switch (returnedCharacter) {
      case "out":
        return "4";
      case hat:
        return "1";
      case hole:
        return "5";
      case fieldCharacter:
        this.row = possiblePosition.row;
        this.col = possiblePosition.col;
        this.field[this.row][this.col] = pathCharacter;
        return "3";
      case pathCharacter:
        return "2";
    }
  }

  getPositionValue({ row, col }) {
    if (row > this.height - 1 || this.height < 0 || col > this.width - 1 || this.width < 0) {
      return "out";
    } else {
      let character = this.field[row][col];
      return character;
    }
  }
};

function generateField(height, width, percentage) {
  let totalChars = height * width;
  let holes = Math.floor((totalChars * percentage) / 100);
  let pathChars = totalChars - holes;
  let field = [];

  let str = "O".repeat(holes) + "░".repeat(pathChars);
  let shuffledStr = [...str].sort(() => Math.random() - 0.5);
  shuffledStr[0] = "*";
  let hatIndex = Math.floor(Math.random() * (totalChars - 1) + 1);
  shuffledStr[hatIndex] = "^";
  while (shuffledStr.length > 0) {
    field.push(shuffledStr.splice(0, height));
  }
  return field;
};

const myField = new Field(generateField(10, 10, 30));

let gameOver = false;

while (!gameOver) {
  myField.print();
  let direction = prompt("Which way? ");
  let validDirections = ["d", "u", "l", "r"];
  if (!validDirections.includes(direction.toLowerCase())) {
    console.log("write valid direction");
    continue;
  }
  let status = myField.move(direction);
  switch (status) {
    case "1":
      console.log("you win");
      gameOver = true;
      break;
    case "2":
      console.log("you already visited this position");
      break;
    case "3":
      break;
    case "4":
      console.log("out of field");
      gameOver = true;
      break;
    case "5":
      console.log("holed");
      gameOver = true;
      break;
  }
}
