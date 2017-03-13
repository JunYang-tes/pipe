// export interface pip<I, O> {
//   (I): O
// }
export type pipe<I, O> = (_in: I) => O
export abstract class Pipe<I, O> {
  private pipe: Pipe<O, any>
  private prevous: Pipe<any, any>
  private lastData: O
  //T is the next pipe's out put type
  to<T>(p: pipe<O, T> | Pipe<O, T>): Pipe<O, T> {
    if (p instanceof Pipe) {
      this.pipe = p
    } else {
      this.pipe = new PipeWrapper<O, T>(p)
    }
    this.pipe.prevous = this
    return this.pipe
  }
  protected beforeStart() {

  }
  protected end() {
    if (this.onEnd() && this.pipe)
      this.pipe.end()
  }
  protected onEnd(): boolean {  
    return true
  }
  async start(): Promise<O> {
    if (this.prevous) {
      await this.prevous.start()
    } else {
      this.beforeStart()
      await this.startPipe()
      this.end()
    }
    return this.getResult()
  }
  protected async startPipe() { }
  protected async getResult(): Promise<O> {
    return new Promise<O>(res => {
      res(this.lastData)
    })
  }
  protected abstract onData(data: I): O;
  protected in(data: I) {
    let d = this.onData(data)
    if (d) {
      this.out(d)
    }
  }
  protected out(data: O) {
    if (this.pipe) {
      this.pipe.in(data)
    }
    this.lastData = data
  }
}
export class PipeWrapper<I, O> extends Pipe<I, O> {
  fn: pipe<I, O>
  constructor(fn: pipe<I, O>) {
    super()
    this.fn = fn
  }
  onData(data: I) {
    return this.fn(data)
  }
}
export abstract class Source<O> extends Pipe<any, O> {
  onData(data: any): O {
    return null
  }
}
export class IterableSource<O> extends Source<O>{
  it: Iterable<O>
  constructor(it: Iterable<O>) {
    super()
    this.it = it
  }
  startPipe() {
    return new Promise<any>(res => {
      for (let d of this.it) {
        this.out(d)
      }
      res()
    })
  }
}
export class Flat<T> extends Pipe<Iterable<T>, T> {
  onData(d) {
    return d
  }
  in(data: Iterable<T>) {
    for (let d of data) {
      this.out(d)
    }
  }
}
export class IterableFlatify<T> extends Pipe<T, T>{
  outIterablepipe: Pipe<T, Iterable<T>> | pipe<T, Iterable<T>>
  constructor(pipe: Pipe<T, Iterable<T>> | pipe<T, Iterable<T>>) {
    super()
    this.outIterablepipe = pipe
  }
  onData(d: T) { return d }
  in(d: T) {
    let fn = this.outIterablepipe as pipe<T, Array<T>>
    let it
    if (fn) {
      it = fn(d)
    } else {
      let p = this.outIterablepipe as Pipe<T, Iterable<T>>
      p.to<Iterable<T>>(d => it = d)
    }
    for (let d of it) {
      this.out(d)
    }
  }
}
export class Collector<T> extends Pipe<T, Array<T>>{
  array: Array<T> = []
  onData(d: T) {
    this.array.push(d)
    return null
  }
  in(d: T) {
    this.onData(d)
  }
  onEnd() {
    this.out(this.array)
    return true
  }
  getResult() {
    return new Promise<Array<T>>(res => res(this.array))
  }
}

export const factory = {
  it<O>(it: Iterable<O>) {
    return new IterableSource<O>(it)
  },
  wrapper<I, O>(fn: pipe<I, O>) {
    return new PipeWrapper(fn)
  },
  flatify<T>(pipe: Pipe<T, Iterable<T>> | pipe<T, Iterable<T>>) {
    return new IterableFlatify(pipe)
  },
  id<T>(fn: (_: T) => any): (_: T) => T {
    return value => {
      fn(value)
      return value
    }
  }
}