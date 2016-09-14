const Continuation = Symbol('Continuation')
const Suspend = Symbol('Suspend')

function log () {
  const d = new Date()
  let args = [].slice.call(arguments)
  const prefix = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}\t`
  args.unshift(prefix)
  console.log.apply(console, args)
}

function isGenerator (fn) {
  if (!fn) {
    return false
  } else {
    return fn.toString() === '[object Generator]'
  }
}

function exec (gen, thread) {
  let stack = []

  function bounce (rval) {
    try {
      while (true) {
        if (isGenerator(rval)) {
          stack.push(rval)
          rval = undefined
        } else if (rval instanceof Error) {
          stack.pop()
          let unwoundGen = stack[stack.length - 1]
          unwoundGen.throw(rval)
        } else if (rval === Suspend) {
          break
        } else if (rval === Continuation) {
          rval = bounce
        } else if (thread) {
          if (thread.switchState) {
            thread.status = 'stopped'
            break
          }
          stack.pop()
        } else {
          stack.pop()
        }

        gen = stack[stack.length - 1]
        if (!gen) {
          break
        }

        rval = gen.next(rval).value
      }
    } catch (e) {
      if (stack.length !== 0) {
        stack.pop()
        let unwoundGen = stack[stack.length - 1]
        unwoundGen.throw(e)
      } else {
        console.error('Uncaught Scheduler Error:', e)
      }
    }
  }

  bounce(gen)
}

function* sleep(ms) {
  setTimeout((yield Continuation), ms)
  yield Suspend
}
