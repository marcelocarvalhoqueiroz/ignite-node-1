const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = []

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find((user) => user.username === username)

  if(!user){
    return response.status(400).json({ error: "User not found!"})
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
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

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  return response.json(user.todo)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body

  const { user } = request

  const todoInput = {
      id: uuidv4(),
      title,
      done: false, 
      deadline: new Date(deadline), 
      created_at: new Date()   
  }

  user.todo.push(todoInput)

  return response.status(201).send()

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { user } = request
  const { id } = request.params

  user.todo.forEach(todo => {
    if(todo.id === id){
      user.todo.title = title
      user.todo.deadline = deadline
    }
  });

  return response.status(201).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params

  user.todo.forEach(todo => {
    if(todo.id === id){
      user.todo.done = true
    }
  });

  return response.status(201).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params

  const newTodoList = user.todo.filter( (todo) => todo.id !== id )

  user.todo = newTodoList

  return response.status(200).json(user)

});

module.exports = app;