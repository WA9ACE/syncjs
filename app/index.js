function* main () {
  log('hello')
  let thread = new Thread(someParallelTask)
  thread.start()
  yield sleep(2500)
  let data = yield request('http://ip.jsontest.com')
  log('ip', data.ip)

  let threadToKill = new Thread(someParallelTaskThatGetsKilled)
  threadToKill.start()
  threadToKill.stop()

  try {
    yield somethingDangerous()
  } catch (e) {
    console.error('Caught', e)
  }

  log('world')
}

function* somethingDangerous () {
  throw new Error('this broke')
}

function* someParallelTask () {
  log('doing something else')
  let data = yield request('http://date.jsontest.com')
  console.log('server time', data.time)
  log('thread finished')
}

function* someParallelTaskThatGetsKilled () {
  log('I will never finish')
  yield sleep(5000)
  log('because I got removed from the scheduler')
}

exec(main())
