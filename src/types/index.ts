export interface DrawConfig {
  uuid: string
  title: string
  min: number
  max: number
  count: number       // cuántos números sacar
  drawAt: number      // timestamp ms cuando se revela
  numbers: number[]   // generados al crear, sellados en la URL
}
