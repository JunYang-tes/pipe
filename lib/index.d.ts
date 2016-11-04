export declare type pipe<I, O> = (_in: I) => O;
export declare abstract class Pipe<I, O> {
    private pipe;
    to<T>(p: pipe<O, T> | Pipe<O, T>): Pipe<O, T>;
    protected abstract onData(data: I): O;
    protected in(data: I): void;
    protected out(data: O): void;
}
export declare class PipeWrapper<I, O> extends Pipe<I, O> {
    fn: pipe<I, O>;
    constructor(fn: pipe<I, O>);
    onData(data: I): O;
}
export declare abstract class Source<O> extends Pipe<any, O> {
    onData(data: any): O;
}
export declare class IterableSource<O> extends Source<O> {
    it: Iterable<O>;
    constructor(it: Iterable<O>);
    start(): void;
}
export declare const factory: {
    it<O>(it: Iterable<O>): IterableSource<O>;
    wrapper<I, O>(fn: pipe<I, O>): PipeWrapper<I, O>;
    id<T>(fn: (_: T) => any): (_: T) => T;
};
