const tokenGlobal = require('./../service/token')
const address = require('./../service/_address')
const login = require('./../user/authorization')
const drawBlocks = require('./../draw/draw.blocks')

const addUser = () => {
  let user = {
    username: document.getElementById('login_name').value,
    password: document.getElementById('login_pass').value
  };

  if (user.username & user.password)
    fetch(address + '/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        password: user.password
      })
    })
      .then(res => res.json())
      .then(token => {
        if (token.status !== 'FAILURE') {
          tokenGlobal.set(token);
          login.logIn()
        }
      })
      .catch(err => { console.log(err) })
  else {
    drawBlocks.loginPrompt.innerHTML = "Enter username and password"
    if (user.username) {
      drawBlocks.loginPrompt.innerHTML = "Enter password"
    }
    if (user.password) {
      drawBlocks.loginPrompt.innerHTML = "What is your name?"
    }
  }
}

const deleteUser = () => {
  fetch(address + '/api/users', {
    method: 'DELETE',
    headers: {
      'authorization': tokenGlobal.get()
    }
  })
    .then(res => res.json())
    .then(() => {
      login.logOut()
    })
    .catch(err => { console.log(err) })
}

module.exports = {
  addUser,
  deleteUser
}