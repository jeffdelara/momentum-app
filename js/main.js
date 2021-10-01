(function(){
    const page1 = document.getElementById('page-1');
    const page2 = document.getElementById('page-2');
    const page3 = document.getElementById('page-3');
    const main = document.querySelector('main');

    let userName = null;

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
    
    const nameinput = document.getElementById('name');
    nameinput.addEventListener('keydown', function(e){
        if(e.key === 'Enter' && nameinput.value) {
            greet(nameinput.value);
            removeNameBtn();
            gotoPage2();
        }
    });

    const nameBtn = document.getElementById('namebtn');
    nameBtn.addEventListener('click', function(){
        if(nameinput.value) {
            greet(nameinput.value);
            removeNameBtn();
            gotoPage2();
        }
    });

    const focus = document.getElementById('focus');
    const focusBtn = document.getElementById('focus-btn');
    focus.addEventListener('keydown', function(e){
        if(e.key === 'Enter')
        {
            if(focus.value) {
                processPage2();
            }
        }
    });
    focusBtn.addEventListener('click', function(){
        if(focus.value) {
            processPage2();
        }
    });

    const focusDiv = document.getElementById('focusdisplay');
    focusDiv.addEventListener('click', createTodos);
    const todoBtn = document.getElementById('todo');
    todoBtn.addEventListener('click', createTodos);


    function toggleTodoItemHandler()
    {
        const todoItem = getTodoById(this.dataset.id);
        todoItem.done = !todoItem.done;
        updateTodo(todoItem);
        processTodoList();
        updateFocusDiv();
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
        todos.push({id: todos.length, item: focus.value, done: false});
        localStorage.setItem('todos', JSON.stringify(todos));
        gotoPage3();
    }

    function getTodos()
    {
        const todos = localStorage.getItem('todos');
        return JSON.parse(todos);
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
        const hours12 = hours > 12 ? hours - 12 : hours;
        const seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();

        return `${hours12}:${minutes}<small>.${seconds} ${ampm}</small>`;
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

    function processTodoList()
    {
        todos = getTodos();
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
            return JSON.parse(localStorage.getItem('todos'));
        }
    }

    function saveTodoLocalStorage(todoObj)
    {
        localStorage.setItem('todos', JSON.stringify(todoObj)); 
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
        focusDiv.innerHTML = `Add your focus`;

        if(todos) {
            for(let _todo of todos) {
                if(_todo.done === false) {
                    focusDiv.innerHTML = _todo.item;
                    break;
                }
            }
        }
    }

    async function getQuotes()
    {
        const data = await fetch('https://api.quotable.io/random');
        const quote = await data.json();
        quotes.content = quote.content;
        quotes.author = quote.author;
    }

})();
