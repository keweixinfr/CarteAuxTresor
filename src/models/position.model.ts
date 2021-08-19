export class Position {
  x: number;
  y: number;
  orientation: number;

  static isPositionDifferent(pA: Position, pB: Position) {
    return pA.x !== pB.x || pA.y !== pB.y;
  }
}