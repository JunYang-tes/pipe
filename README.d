# Object pipe

```typescript
import * as Pipe from "pipe"
let nums = new Pipe.IterableSource([1, 2, 3, 4, 5, 6, 7])
nums.to<number>((n) => n * n)
  .to(n => n % 2 === 0 ? n : null)
  .to(n=>n+" postfix")
  .to(n => console.log(n))
nums.start()
```