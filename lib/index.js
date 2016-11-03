"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pipe {
    to(p) {
        if (p instanceof Pipe) {
            this.pipe = p;
        }
        else {
            this.pipe = new PipeWrapper(p);
        }
        return this.pipe;
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
class IdPipe extends Pipe {
    constructor(fn) {
        super();
        this.fn = fn;
    }
    onData(data) {
        this.fn(data);
        return data;
    }
}
exports.IdPipe = IdPipe;
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
    start() {
        for (let d of this.it) {
            this.out(d);
        }
    }
}
exports.IterableSource = IterableSource;
exports.factory = {
    it(it) {
        return new IterableSource(it);
    },
    wrapper(fn) {
        return new PipeWrapper(fn);
    },
    id(fn) {
        return new IdPipe(fn);
    }
};
//# sourceMappingURL=index.js.map