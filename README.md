# Object pipe  
```typescript
import * as Pipe from "../lib"
const { id, it } = Pipe.factory
let nums = it([1, 2, 3, 4, 5, 6, 7])
nums
  .to<number>(id<number>(d => {
    console.log("old:", d)
  }))
  .to<number>(d => d + 1)
  .to<string>(d => d + " postfix")
  .to<string>(id<string>(d => {
    console.log("converted :", d)
  }))
nums.start()
```
