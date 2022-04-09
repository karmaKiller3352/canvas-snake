import './style.scss'
import { DirectionEnum, ICoordinates, IGameConfig } from './types'



class SnakeGame {
  private ctx: CanvasRenderingContext2D
  private config: IGameConfig

  private intervalId: any = null

  private direction: DirectionEnum = DirectionEnum.UP
  private coordinates: ICoordinates
  private isGameStarted: boolean = false

  private snakeBody: Array<ICoordinates> = []

  private moveTo = {
    [DirectionEnum.UP]: () => {
      this.coordinates.y = this.coordinates.y - 1
    },
    [DirectionEnum.DOWN]: () => {
      this.coordinates.y = this.coordinates.y + 1
    },
    [DirectionEnum.LEFT]: () => {
      this.coordinates.x = this.coordinates.x - 1
    },
    [DirectionEnum.RIGHT]: () => {
      this.coordinates.x = this.coordinates.x + 1
    }
  }

  constructor(elementId: string, config: IGameConfig) {
    const canvas = document.getElementById(elementId) as HTMLCanvasElement
    canvas.width = config.canvasSize.height
    canvas.height = config.canvasSize.width
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    this.config = config
    this.generateGrid()

    this.coordinates = this.getStartingCoordinates()
  }

  private getStartingCoordinates = (): ICoordinates => ({
    x: Math.round((this.config.canvasSize.width / this.config.cellsize.width) / 2),
    y: Math.round((this.config.canvasSize.height / this.config.cellsize.height) / 2)
  })

  private generateGrid = () => {
    const canvasWidth = this.config.canvasSize.width
    const canvasHeight = this.config.canvasSize.height

    const cellWidth = this.config.cellsize.width
    const cellHeight = this.config.cellsize.height

    for (let x = 0; x < canvasWidth; x += cellWidth) {
      for (let y = 0; y < canvasHeight; y += cellHeight) {
        this.ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    }
  }

  private mooveSnake = () => {
    this.moveTo[this.direction]()
    this.renderSnake()
  }

  private isCollided = () => {
    const xCurrent = this.coordinates.x * this.config.cellsize.width
    const yCurrent = this.coordinates.y * this.config.cellsize.height

    return xCurrent < 0
      || xCurrent > this.config.canvasSize.width
      || yCurrent < 0
      || yCurrent > this.config.canvasSize.height
  }

  private renderSnake = () => {
    const cellIndent = this.config.cellIndent || 0
    const x = this.coordinates.x * this.config.cellsize.width + cellIndent
    const y = this.coordinates.y * this.config.cellsize.height + cellIndent

    const snakeWidth = this.config.cellsize.width - cellIndent * 2
    const snakeHeight = this.config.cellsize.height - cellIndent * 2

    this.snakeBody.push({
      x, y
    })

    if (this.isCollided()) {
      return this.stopGame(true)
    }

    this.ctx.fillRect(x, y, snakeWidth, snakeHeight)


    if (this.snakeBody.length > 1) {
      const tail = this.snakeBody.shift();

      if (tail) {
        this.ctx.clearRect(tail.x, tail.y, snakeWidth, snakeHeight);
      }
    }
  }

  private stopGame = (endGame: boolean = false) => {
    clearInterval(this.intervalId)

    this.isGameStarted = false

    if (endGame) {
      alert('You lost')
      this.ctx.clearRect(0, 0, this.config.canvasSize.width, this.config.canvasSize.height);
    }
  }

  private controlsListner = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      if (this.isGameStarted) {
        this.stopGame()
      } else {
        this.startGame()
      }
    }

    if (e.code === 'ArrowRight') {
      this.direction = DirectionEnum.RIGHT
    }

    if (e.code === 'ArrowLeft') {
      this.direction = DirectionEnum.LEFT
    }

    if (e.code === 'ArrowDown') {
      this.direction = DirectionEnum.DOWN
    }

    if (e.code === 'ArrowUp') {
      this.direction = DirectionEnum.UP
    }
  }

  private startGame = () => {
    this.generateGrid()
    this.coordinates = this.getStartingCoordinates()
    this.isGameStarted = true
    this.intervalId = setInterval(this.mooveSnake, 500)
  }

  public start = () => {
    document.addEventListener('keydown', this.controlsListner)
  }
}


const gameConfig: IGameConfig = {
  canvasSize: {
    width: 400,
    height: 400
  },
  cellsize: {
    width: 40,
    height: 40
  },
  cellIndent: 3
}

const game = new SnakeGame('canvas', gameConfig)
game.start()











