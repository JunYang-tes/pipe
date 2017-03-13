"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Pipe {
    //T is the next pipe's out put type
    to(p) {
        if (p instanceof Pipe) {
            this.pipe = p;
        }
        else {
            this.pipe = new PipeWrapper(p);
        }
        this.pipe.prevous = this;
        return this.pipe;
    }
    beforeStart() {
    }
    end() {
        if (this.onEnd() && this.pipe)
            this.pipe.end();
    }
    onEnd() {
        return true;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.prevous) {
                yield this.prevous.start();
            }
            else {
                this.beforeStart();
                yield this.startPipe();
                this.end();
            }
            return this.getResult();
        });
    }
    startPipe() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getResult() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(res => {
                res(this.lastData);
            });
        });
    }
    in(data) {
        let d = this.onData(data);
        if (d) {
            this.out(d);
        }
    }
    out(data) {
        if (this.pipe) {
            this.pipe.in(data);
        }
        this.lastData = data;
    }
}
exports.Pipe = Pipe;
class PipeWrapper extends Pipe {
    constructor(fn) {
        super();
        this.fn = fn;
    }
    onData(data) {
        return this.fn(data);
    }
}
exports.PipeWrapper = PipeWrapper;
class Source extends Pipe {
    onData(data) {
        return null;
    }
}
exports.Source = Source;
class IterableSource extends Source {
    constructor(it) {
        super();
        this.it = it;
    }
    startPipe() {
        return new Promise(res => {
            for (let d of this.it) {
                this.out(d);
            }
            res();
        });
    }
}
exports.IterableSource = IterableSource;
class Flat extends Pipe {
    onData(d) {
        return d;
    }
    in(data) {
        for (let d of data) {
            this.out(d);
        }
    }
}
exports.Flat = Flat;
class IterableFlatify extends Pipe {
    constructor(pipe) {
        super();
        this.outIterablepipe = pipe;
    }
    onData(d) { return d; }
    in(d) {
        let fn = this.outIterablepipe;
        let it;
        if (fn) {
            it = fn(d);
        }
        else {
            let p = this.outIterablepipe;
            p.to(d => it = d);
        }
        for (let d of it) {
            this.out(d);
        }
    }
}
exports.IterableFlatify = IterableFlatify;
class Collector extends Pipe {
    constructor() {
        super(...arguments);
        this.array = [];
    }
    onData(d) {
        this.array.push(d);
        return null;
    }
    in(d) {
        this.onData(d);
    }
    onEnd() {
        this.out(this.array);
        return true;
    }
    getResult() {
        return new Promise(res => res(this.array));
    }
}
exports.Collector = Collector;
exports.factory = {
    it(it) {
        return new IterableSource(it);
    },
    wrapper(fn) {
        return new PipeWrapper(fn);
    },
    flatify(pipe) {
        return new IterableFlatify(pipe);
    },
    id(fn) {
        return value => {
            fn(value);
            return value;
        };
    }
};
//# sourceMappingURL=index.js.map