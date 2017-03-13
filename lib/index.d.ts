export declare type pipe<I, O> = (_in: I) => O;
export declare abstract class Pipe<I, O> {
    private pipe;
    private prevous;
    private lastData;
    to<T>(p: pipe<O, T> | Pipe<O, T>): Pipe<O, T>;
    protected beforeStart(): void;
    protected end(): void;
    protected onEnd(): boolean;
    start(): Promise<O>;
    protected startPipe(): Promise<void>;
    protected getResult(): Promise<O>;
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
    startPipe(): Promise<any>;
}
export declare class Flat<T> extends Pipe<Iterable<T>, T> {
    onData(d: any): any;
    in(data: Iterable<T>): void;
}
export declare class IterableFlatify<T> extends Pipe<T, T> {
    outIterablepipe: Pipe<T, Iterable<T>> | pipe<T, Iterable<T>>;
    constructor(pipe: Pipe<T, Iterable<T>> | pipe<T, Iterable<T>>);
    onData(d: T): T;
    in(d: T): void;
}
export declare class Collector<T> extends Pipe<T, Array<T>> {
    array: Array<T>;
    onData(d: T): any;
    in(d: T): void;
    onEnd(): boolean;
    getResult(): Promise<T[]>;
}
export declare const factory: {
    it<O>(it: Iterable<O>): IterableSource<O>;
    wrapper<I, O>(fn: pipe<I, O>): PipeWrapper<I, O>;
    flatify<T>(pipe: Pipe<T, Iterable<T>> | pipe<T, Iterable<T>>): IterableFlatify<T>;
    id<T>(fn: (_: T) => any): (_: T) => T;
};
