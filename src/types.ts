export enum DirectionEnum {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP = 'UP',
  DOWN = 'DOWN',
}

export interface ICoordinates {
  x: number,
  y: number
}

export interface ICellSize {
  width: number,
  height: number
}

export interface ICanvasSize {
  width: number,
  height: number
}

export interface IGameConfig {
  canvasSize: ICanvasSize,
  cellsize: ICellSize
  cellIndent?: number
}