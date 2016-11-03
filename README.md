# Object pipe  
```typescript
import * as Pipe from "../lib"
const { id, it } = Pipe.factory
let nums = it([1, 2, 3, 4, 5, 6, 7])
nums.to<number>((n) => n * n)
  .to(n => n % 2 === 0 ? n : null)
  .to(n => n + " postfix")
  .to(id(d => {
    console.log(this)
    console.log(d);
  }))
nums.start()
```
