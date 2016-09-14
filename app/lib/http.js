function _xhr (url, continuation) {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', url)

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        continuation(JSON.parse(xhr.responseText))
      } else {
        continuation(new Error(`XMLHttpRequest Error: ${this.statusText} : ${this.status}`))
      }
    }
  }

  xhr.send()
}

function* request (url) {
  _xhr(url, (yield Continuation))
  yield Suspend
}
