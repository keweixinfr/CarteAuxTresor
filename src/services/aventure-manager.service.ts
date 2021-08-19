import { Injectable } from '@angular/core';
import { Adventurer } from 'src/models/adventurer.model';
import { Position } from 'src/models/position.model';
import { ORIENTATIONS } from 'src/utils/constants/orientations.constant';

@Injectable({
  providedIn: 'root'
})
export class AventureManagerService {

  mapX: number; // map width minus 1
  mapY: number; // map height minus 1
  listMountains: {[key: string]: number } = {};
  listTreasures: {[key: string]: number } = {};
  listAdventurers: Adventurer[] = [];
  totalRound: number = 0;
  currRound: number = 0;

  constructor() { }

  /**
   * 
   * @param startingStr a string contains the starting state of the carte aux trésors
   * @returns a string contains the result of the carte aux trésors
   */
  getAdventureResult(startingStr: string): string {
    this._resetService();
    this._extractStartingState(startingStr);
    this._simulateAdventure();
    const endingStr = this._transformToResultStr();
    return endingStr;
  }

  /**
   * extract the starting state (map size, player, mountains etc...) of the adventure and init the service
   * 
   * @param startingStr a string contains the starting state of the carte aux trésor
   */
  private _extractStartingState(startingStr: string){
    const listValidCommand = this._cleanText(startingStr);
    if (listValidCommand && listValidCommand.length > 0) {
      listValidCommand.forEach(validCommand => {
        switch (validCommand[0]) {
          case 'C':
            this.mapX = parseInt(validCommand[1], 10) - 1; // minus 1 to facilitate manipulation
            this.mapY = parseInt(validCommand[2], 10) - 1; // minus 1 to facilitate manipulation
            break;
          case 'M':
            this.listMountains[validCommand[1] + '-' + validCommand[2]] = 1;
            break;
          case 'T':
            this.listTreasures[validCommand[1] + '-' + validCommand[2]] = parseInt(validCommand[3], 10);
            break;
          case 'A':
            const newAdventurer = new Adventurer(validCommand[1], validCommand[2], validCommand[3], validCommand[4], validCommand[5])
            this.listAdventurers.push(newAdventurer);
            this.totalRound = newAdventurer.mouvement.length > this.totalRound ? newAdventurer.mouvement.length : this.totalRound;
            break;
          default:
            break;
        }
      });      
    }
  }

  /**
   * Simulate the adventure, the result will set directly on the service variables
   */
  private _simulateAdventure() {
    for (let currRound = 0; currRound < this.totalRound; currRound++) {
      this.listAdventurers.forEach((adventurer, adventurerIndex) => {
        const presumeNextPosition = adventurer.getNextPosition(currRound); // presuming next position of the adventurer
        if (this._isAllowToMove(presumeNextPosition, adventurerIndex)) {
          const isPositionChange = Position.isPositionDifferent(adventurer, presumeNextPosition); 
          adventurer.setPosition(presumeNextPosition);
          if (isPositionChange && this._isHaveTreasure(presumeNextPosition)) {
            adventurer.takeTreasure(this.listTreasures);
          }
        }
      }) 
    }
  }


  /**
   * 
   * @returns a string contains the ending state of the carte aux trésor
   */
  private _transformToResultStr(): string {
    const resultArray = [];
    resultArray.push(['C', this.mapX + 1, this.mapY + 1]);
    for (let key in this.listMountains) {
      if (this.listMountains.hasOwnProperty(key)) {
         resultArray.push(['M', ...key.split('-')])
      }
    }
    for (let key in this.listTreasures) {
      if (this.listTreasures.hasOwnProperty(key)) {
         resultArray.push(['T', ...key.split('-'), this.listTreasures[key]])
      }
    }
    this.listAdventurers.forEach(adventurer => {
      resultArray.push(['A', adventurer.name, adventurer.x, adventurer.y, ORIENTATIONS[adventurer.orientation], adventurer.treasure]);
    })
    return resultArray.map(item => item.join(' - ')).join('\n');
  }

  /**
   * Reset the service before each adventure
   */
  private _resetService() {
    this.mapX = null;
    this.mapY = null;
    this.listMountains= {};
    this.listTreasures= {};
    this.listAdventurers = [];
    this.totalRound = 0;
    this.currRound= 0;
  }

  private _cleanText(dirtyStr: string): string[][] {
    return dirtyStr.trim().split(/\r?\n/).filter(str => str && str[0] !== "#").map(str => str.replace(/\s+/g, '').split('-'));
  }

  private _isAllowToMove(presumeNextPosition, currAdventurerIndex): boolean {
    return !this._isOutOfMap(presumeNextPosition) && !this._isEnterMountain(presumeNextPosition) && !this._isHaveOtherAdventurer(presumeNextPosition, currAdventurerIndex);
  }

  private _isOutOfMap(position: Position): boolean {
    return position.x < 0 || position.x > this.mapX || position.y < 0 || position.y > this.mapY;
  }

  private _isEnterMountain(position: Position): boolean {
    return !!this.listMountains[position.x + '-' + position.y];
  }

  private _isHaveOtherAdventurer(position: Position, currAdventurerIndex: number): boolean {
    return !!this.listAdventurers.filter((_, index) => index !== currAdventurerIndex).find(adventurer => adventurer && adventurer.x === position.x && adventurer.y === position.y);
  }

  private _isHaveTreasure(position: Position) {
    return !!this.listTreasures[position.x + '-' + position.y];
  }
}


