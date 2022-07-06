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

function checkTodoExists(request, response, next) {
  const { id } = request.params
  const { user } = request

  const todo = user.todo.find( (todo) => todo.id === id)

  if(!todo){
    return response.status(404).json({ error: "Todo not exists!"})
  }

  request.todo = todo
  
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

  return response.status(201).send()
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

app.put('/todos/:id', checksExistsUserAccount, checkTodoExists, (request, response) => {
  const { title, deadline } = request.body
  const { todo } = request

  todo.title = title
  todo.deadline = new Date(deadline)
    
  return response.status(201).send()  
})

app.patch('/todos/:id/done', checksExistsUserAccount, checkTodoExists, (request, response) => {
  const { todo } = request
  
  todo.done = true

  return response.status(201).send()
});

app.delete('/todos/:id', checksExistsUserAccount, checkTodoExists, (request, response) => {
  const { todo } = request
  const { user } = request 

  const newTodoList = user.todo.filter( (item) => item.id !== todo.id )

  user.todo = newTodoList

  return response.status(204)

});

module.exports = app;