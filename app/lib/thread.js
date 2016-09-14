function Thread (generator) {
  this.status = 'running'
  this.switchState = false

  this.start = () => {
    setTimeout(() => {
      exec(generator(), this)
    })
  }
  
  this.stop = () => {
    this.switchState = true
  }

  return this
}
