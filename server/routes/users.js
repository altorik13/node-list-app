let { statuses, httpStatuses } = require('../config/constants');
let express = require('express');
let router = express.Router();

let Users = require('../database/users');
let List = require('../database/tasks');

router.get('/users', (req, res) => {
  if (req.user) {
    Users.getUserById(req.user._id)
      .then(user => { res.json(user) })
      .catch(err => { res.status(httpStatuses.SERVER_ERROR).json({ status: statuses.failure, user: {}, error_text: err.message }) });
  } else {
    Users.getUsers()
      .then(users => { res.json(users) })
      .catch(err => { res.status(httpStatuses.SERVER_ERROR).json({ status: statuses.failure, users: {}, error_text: err.message }) });
  }
});

router.post('/users', (req, res) => {
  //check if user is unique
  Users.addUser(req.body.username, req.body.password)
    .then(newUser => {
      let query = '?'
      query += 'username=' + newUser.username + '&'
      query += 'password=' + newUser.password + '&'

      res.redirect('login/' + query);
    })
    .catch(err => { res.status(httpStatuses.SERVER_ERROR).json({ status: statuses.failure, user: {}, error_text: err.message }) });
});

router.put('/users', (req, res) => {
  if (req.user) {
    console.log(req.body)
    console.log(req.body.val)
    console.log(req.body.key)
    let change = {}
    change[req.body.key] = req.body.val
    console.log(change)
    Users.updateUser({ _id: req.user._id }, change)
      .then(newUser => {
        console.log(newUser)
        res.json(newUser)

        // let query = '?'
        // query += 'username=' + newUser.username + '&'
        // query += 'password=' + newUser.password + '&'

        // res.redirect('login/' + query);
      })
      .catch(err => { res.status(httpStatuses.SERVER_ERROR).json({ status: statuses.failure, user: {}, error_text: err.message }) });
  }
});

router.delete('/users', (req, res) => {
  //delete user's tasks
  if (req.user) {
    if (req.user._id)
      Users.removeUser(req.user._id)
        .then(data => res.json(data))
        .catch(err => { res.status(httpStatuses.SERVER_ERROR).json({ status: statuses.failure, user: {}, error_text: err.message }) });
  } else
    res.status(httpStatuses.LOGIN).send('No such user')
})

//service - delete all users
router.delete('/users/clear', (req, res) => {
  Users.removeAllUsers()
    .then(data => res.json(data))
    .catch(err => { res.status(httpStatuses.SERVER_ERROR).json({ status: statuses.failure, user: {}, error_text: err.message }) });
})

//strictly after /clear

// router.get('/users/:id', (req, res) => {
//   Users.getUserById(req.params.id)
//     .then(user => { res.json(user) })
//     .catch(err => { res.status(httpStatuses.SERVER_ERROR).json({ status: statuses.failure, user: {}, error_text: err.message }) });
// });

module.exports = router;