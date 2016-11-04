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
Or
```typescript
import * as Pipe from "../lib"
const { id, it } = Pipe.factory
let nums = it([1, 2, 3, 4, 5, 6, 7])
let p = nums
  .to(id<number>(d => console.log(d))) // a Pipe<number,number>
  .to(d => d + 1) // a Pipe<number,number> that is d is a number
  .to(d => d + " postfix") // a Pipe<number,string> that is d is a number
  .to(d => d.toUpperCase()) // a Pipe<string,string> that is d is a string
  .to(d => ({  // a Pipe<Object,Object> typescript knows that d has a property called str
    str: d
  }))
  .to(d => {
    //typscript knows that d has a property str
    console.log(d, d.str)
    return d
  })
  .to(id<{ str: string }>(d => {
    console.log(d, d.str)
  }))  // a Pipe<Object,Object> which object looks like { str:string }
nums.start()
```
