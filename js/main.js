const page1 = document.getElementById('page-1');
const page2 = document.getElementById('page-2');
const page3 = document.getElementById('page-3');
const main = document.querySelector('main');

let userName = null;
let myFocus = null;
let todos = [];

const quotes = { content: "All I want to know is where I'm going to die. So I'll never go there.", 
                author: 'Anonymous' };

const bg = ["emerald-lake.jpg", 
            "prags-lake.jpg", 
            "slovakia-cabin.jpg", 
            "ijen-crater.jpg", 
            "guernsey.jpg", 
            "valley-flower.jpg",
            "tree-canopy.jpg", 
            "cherry-blossoms.jpg", 
            "pragser.jpg",
            "ghode-pani.jpg",
            "plansee.jpg"
        ];

const random = Math.floor(Math.random() * bg.length);
main.style.backgroundImage = `url(images/${bg[random]})`;

getQuotes();


if(localStorage.getItem('username'))
{
    userName = localStorage.getItem('username');
    hideAllPages();
    gotoPage3();
}
else 
{
    setTimeout(function(){
        page1.classList.toggle('hide');
    }, 800);
}

function toggleTodoItemHandler()
{
    const todoItem = getTodoById(this.dataset.id);
    
    todoItem.done = !todoItem.done;
    updateTodo(todoItem);
    this.classList.toggle('done');
}

function gotoPage2()
{
    page1.classList.toggle('hide');
    page2.classList.toggle('hide');
}

function gotoPage3()
{
    clock.innerHTML = "";
    clock.innerHTML = getTimeNow();
    greetLoggedinUser();
    const quoteDiv = document.getElementById('quotes');

    processTodoList();

    setTimeout(function(){
        page2.classList.add('hide');
        page3.classList.toggle('hide');

        quoteDiv.innerHTML = `"${quotes.content}"<br><i class="author">${quotes.author}</i>`;
        
        updateFocusDiv();

        const clock = document.getElementById('clock');
        setInterval(function(){
            clock.innerHTML = "";
            clock.innerHTML = getTimeNow();
        }, 1000);
    }, 1000);

    setInterval(function(){
        getQuotes();
        quoteDiv.innerHTML = `"${quotes.content}"<br><i class="author">${quotes.author}</i>`;
    }, 1000 * 60 * 5);
}

function greet(name)
{
    const greeting = document.getElementById('greeting');
    greeting.textContent = `Hi there, ${name}!`;
    userName = name;
    setLocalStorage('username', userName);
}

function greetLoggedinUser()
{
    const greet = document.getElementById('loggedingreet');
    const now = new Date();
    const hours = now.getHours();
    let greeting = '';
    if(hours < 12) 
    {
        greeting = `Good morning, ${userName}.`;
    }

    else if(hours >= 12 && hours < 18) 
    {
        greeting = `Good afternoon, ${userName}.`;
    }

    else if(hours >= 18)
    {
        greeting = `Good evening, ${userName}.`;
    }

    greet.textContent = greeting;
}

function processPage2()
{
    page2.classList.add('hide');
    myFocus = focus.value;
    localStorage.setItem('focus', myFocus);
    gotoPage3();
}

function removeNameBtn()
{
    nameBtn.remove();
    nameinput.remove();
}

function getTimeNow()
{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    let hours12 = hours > 12 ? hours - 12 : hours;
    hours12 = hours12 < 10 ? '0' + hours12 : hours12;
    const seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();

    
    return `<div id="clock-display">
        <div>${hours12}</div>
        <div>:</div>
        <div>${minutes}</div>
        <div class="second">.${seconds} ${ampm}</div>
    </div>`;
}

function setLocalStorage(userKey, userName)
{
    localStorage.setItem(userKey, userName);
}

function hideAllPages()
{
    page1.classList.add('hide');
    page2.classList.add('hide');
    page3.classList.add('hide');
}

function createTodos()
{
    const todoListModal = document.getElementById('todo-modal');
    todoListModal.classList.toggle('hide');
}

function newFocusHandler()
{
    this.classList.toggle('hide');
    let focusText = focusDiv.textContent;
    focusDiv.innerHTML = "";
    const focusInput = document.createElement('input');
    focusInput.setAttribute('class', 'nomargin');
    focusInput.addEventListener('keydown', updateFocus);
    focusInput.value = focusText;
    focusDiv.append(focusInput);
    focusInput.focus();
}

function updateFocus(e)
{
    if(this.value) 
    {
        if(e.key === 'Enter')
        {
            myFocus = this.value;
            localStorage.setItem('focus', myFocus);
            updateFocusDiv();
            const editFocusDiv = document.querySelector('.edit-focus')
            editFocusDiv.classList.toggle('hide');
        }

        if(e.key === 'Escape')
        {
            updateFocusDiv();
            const editFocusDiv = document.querySelector('.edit-focus')
            editFocusDiv.classList.toggle('hide');
        }
    }
}

function processTodoList()
{
    todos = getLocalStorageTodosObject();
    const todoUl = document.getElementById('todo-ul');
    todoUl.innerHTML = "";

    if(todos) {
        for(let _todo of todos)
        {
            const li = document.createElement('li');
            li.setAttribute('data-id', _todo.id);
            li.addEventListener('click', toggleTodoItemHandler);
            if(_todo.done) {
                li.setAttribute('class', 'todo-item');
                li.classList.add('done');
            } else {
                li.setAttribute('class', 'todo-item');
            }
            li.innerHTML = _todo.item;
            todoUl.append(li);
        }
    }
}

function getTodoById(id)
{
    const todosObj = getLocalStorageTodosObject();
    for(let _todo of todosObj) {
        if(_todo.id === parseInt(id)) {
            return _todo;
        }
    }
}

function getLocalStorageTodosObject()
{
    if(localStorage.getItem('todos'))
    {
        const items = JSON.parse(localStorage.getItem('todos'));
        items.sort(function(a, b) { 
            return b.id - a.id  ||  b.item.localeCompare(a.item);
            });
        
        return items;
    }

    return false;
}

function saveTodoLocalStorage(todoObj)
{
    localStorage.setItem('todos', JSON.stringify(todoObj)); 
}

function insertTodo(todoContent)
{
    let _todos = getLocalStorageTodosObject();
    const todoItem = { id: _todos.length || 0, item: todoContent, done: false };

    if(_todos) {
        _todos.push(todoItem);
        
    } else {
        _todos = [todoItem];
    }
    saveTodoLocalStorage(_todos);
}

function updateTodo(todoItem)
{
    const _todos = getLocalStorageTodosObject();
    for(let i = 0; i < _todos.length; i++) 
    {
        if(_todos[i].id === todoItem.id) {
            _todos.splice(i, 1);
            _todos.push(todoItem);
            break;
        }
    }
    saveTodoLocalStorage(_todos);
}

function updateFocusDiv()
{
    focusDiv.innerHTML = '';
    focusDiv.innerHTML = localStorage.getItem('focus');
}

async function getQuotes()
{
    const favoriteAuthors = [
        'socrates', 
        'epictetus',
        'marcus-aurelius',
        'arthur-schopenhauer',
        'plato', 
        'aristotle',
        'buddha', 
        'benjamin-franklin',
        'confucius', 
        'laozi', 
        'diogenes', 
        'cicero'
    ];

    const randomIndex = Math.floor(Math.random() * favoriteAuthors.length);
    const data = await fetch(`https://api.quotable.io/random?author=${favoriteAuthors[randomIndex]}`);
    const quote = await data.json();

    if(quote.statusCode == '404') {
        console.log('Can not fetch quote. Displaying default quote instead. :)');
    } else {
        quotes.content = quote.content;
        quotes.author = quote.author;
    }
}

function clearTodoHandler()
{
    localStorage.setItem('todos', '');
    processTodoList();
}
