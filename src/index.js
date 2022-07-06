const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = []


// ok
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find((user) => user.username === username)

  if(!user){
    return response.status(400).json({ error: "User not found!"})
  }

  request.user = user

  return next()
}

// ok
app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  const userAlreadyExists = users.some(
    (user) => user.username === username
  )
  
  if(userAlreadyExists){
    return response.status(400).json({ error: "User already exists!"})
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todo: []
  })

  return res.status(201).send()
});

// ok
app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  return response.json(user.todo)
});

// ok
app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body

  const { user } = request

  const todoInput = {
      id: uuidv4(),
      title,
      done: false, 
      deadline, 
      created_at: new Date()   
  }

  user.todo.push(todoInput)

  return response.status(201).send()

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;