export default class Signal<Value> {
  readonly value: Value
  readonly startTime: number

  constructor(value: Value, startTime: number) {
    this.value = value
    this.startTime = startTime
  }
}
