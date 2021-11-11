export type CircleData = {
    x: number;
    y: number;
    radius: number;
}

export interface ICircle {
  getDimensions(): CircleData
}
