export interface pipe<I, O> {
  (I): O
}
export abstract class Pipe<I, O> {
  private pipe: Pipe<O, any>
  to<T>(p: pipe<O, T> | Pipe<O, T>): Pipe<O, T> {
    if (p instanceof Pipe) {
      this.pipe = p
    } else {
      this.pipe = new PipeWrapper<O, T>(p)
    }
    return this.pipe
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
  start() {
    for (let d of this.it) {
      this.out(d)
    }
  }
}
