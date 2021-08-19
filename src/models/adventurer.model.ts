import { ORIENTATIONS } from "src/utils/constants/orientations.constant";
import { Position } from "./position.model";

export class Adventurer implements Position{
  name: string
  x: number;
  y:number;
  orientation: number;
  mouvement: string;
  treasure: number;

  constructor(name: string, x: string, y:string, orientation: string, mouvement: string) {
    this.name = name;
    this.x = parseInt(x, 10);
    this.y = parseInt(y, 10);
    this.orientation = ORIENTATIONS.indexOf(orientation);
    this.mouvement = mouvement;
    this.treasure = 0;
  }

  getNextPosition(roundIndex): Position {
    switch (this.mouvement[roundIndex]) {
      case 'A':
        switch (this.orientation) {
          case 0: // North
            return {x: this.x, y: this.y - 1, orientation: this.orientation}     
          case 1: // Est
            return {x: this.x + 1, y: this.y, orientation: this.orientation}     
          case 2: // South
            return {x: this.x, y: this.y + 1, orientation: this.orientation}     
          case 3: // West
            return {x: this.x - 1, y: this.y, orientation: this.orientation}        
          default:
            return {x: this.x, y: this.y, orientation: this.orientation};
        }
      case 'D':
        return {x: this.x, y: this.y, orientation: (this.orientation + 1) % 4};
      case 'G':
        return {x: this.x, y: this.y, orientation: (this.orientation + 3) % 4};
      default:
        return {x: this.x, y: this.y, orientation: this.orientation};
    }  
  }

  setPosition(nextPosition: Position) {
    this.x = nextPosition.x;
    this.y = nextPosition.y;
    this.orientation = nextPosition.orientation;
  }

  takeTreasure(listTreasures: {[key: string]: number }) {
    if (listTreasures[this.x + '-' + this.y]) {
      listTreasures[this.x + '-' + this.y]--;
      this.treasure++;
    }
  }
}
