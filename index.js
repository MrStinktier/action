const net = require('net')

let oldping
let newping

run()

async function run() {
  newping = await pingPort('storj.mr-stinktier.uk', 28967)
  if (oldping !== newping) {
    if (newping) {
      Send_Message('@everyone\nDer Storj Server ist: OK')
    } else {
      Send_Message('@everyone\nDer Storj Server ist: Critical')
    }
  }
  oldping = newping
}

function pingPort(host, port, timeout = 3000) {
  return new Promise(require => {
    const socket = new net.Socket()

    // Connect to the host and port
    socket.setTimeout(timeout)
    socket.on('connect', () => {
      socket.destroy() // Close the connection
      require(true)
    })

    socket.on('timeout', () => {
      socket.destroy()
      require(false)
    })

    socket.on('error', err => {
      socket.destroy()
      require(false)
    })

    socket.connect(port, host)
  })
}

async function Send_Message(pingstatus) {
  fetch(
    'https://discord.com/api/webhooks/1304462634283831366/5pN8rFJfPd-zd_a7A6ARQLDqLmfR09H2DnSemAPfl91IJugb4RviQ7IpcYlPw0aPolGF',
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // the username to be displayed
        username: 'Storj-Check',
        // the avatar to be displayed
        avatar_url: '',
        // contents of the message to be sent
        content: pingstatus
      })
    }
  )
}

setInterval(async () => {
  await run()
}, 1000)
