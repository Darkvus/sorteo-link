export interface DrawConfig {
  uuid: string
  title: string
  min: number
  max: number
  count: number       // cuántos números sacar
  drawAt: number      // timestamp ms cuando se revela
  createdAt: number   // timestamp ms cuando se creó
  numbers: number[]   // generados al crear, sellados en la URL
}
