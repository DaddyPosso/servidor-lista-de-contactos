const REGEX_NAME = /^[A-Z][a-z ]*[A-Z][a-z]*$/;
const NUMBER_REGEX = /^[0]((424)|(426)|(412)|(414)|(416))[0-9]{7}$/;

const formTodo = document.querySelector('#form-todos');
const formInput = document.querySelector('#form-input');
const todoList = document.querySelector('#todos-list');
const user = JSON.parse(localStorage.getItem('user'));
const closeBtn = document.querySelector('#cerrar-btn');

  if(!user) {
    window.location.href = '../home/index.html';
  }


formTodo.addEventListener('submit', async e => {
 e.preventDefault();
 const responseJSON = await fetch('http://localhost:3000/todos', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({text: formInput.value, user: user.username, cheked: false}),
}); 

const response = await responseJSON.json();
const listItem = document.createElement('li');
listItem.innerHTML = `
 <li class="todo-item" id="${response.id}">
  <button class="delete-btn">&#10006;</button>
  <p>${response.text}</p>
  <button class="check-btn">&#10003;</button>
</li>
`;
todoList.append(listItem);
formInput.value = '';

 
});
todoList.addEventListener('click', async e => {
    if (e.target.classList.contains('delete-btn')){
      const id = (e.target.parentElement.id);
     await fetch(`http://localhost:3000/todos/${id}`, {method: 'DELETE',}); 
     e.target.parentElement.remove();
} else if (e.target.classList.contains('check-btn')) {
  const id = e.target.parentElement.id;
await fetch(`http://localhost:3000/todos/${id}`, {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({cheked: e.target.parentElement.children[1].classList.contains('check-todo') ? false : true }),
}); 

e.target.parentElement.children[1].classList.toggle('check-todo');

}
 });

 closeBtn.addEventListener('click', async e => {
 localStorage.removeItem('user');
 window.location.href = '../home/index.html';
});


const getTodos = async () => {
  const response = await fetch('http://localhost:3000/todos', {method: 'GET'});
  const todos = await response.json();
  console.log(todos);
  const userTodos = todos.filter(todo => todo.user === user.username);
 console.log(userTodos);
  userTodos.forEach(todo =>  {
    const listItem = document.createElement('li');
listItem.innerHTML = `
 <li class="todo-item" id="${todo.id}">
  <button class="delete-btn">&#10006;</button>
  <p ${todo.cheked ? 'class="check-todo"' : null} >${todo.text}</p>
  <button class="check-btn">&#10003;</button>
</li>
`;
todoList.append(listItem);
  });
}

getTodos()



