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
const editFocusDiv = document.querySelector('.edit-focus')
editFocusDiv.addEventListener('click', newFocusHandler);

const todoBtn = document.getElementById('todo');
todoBtn.addEventListener('click', createTodos);

const todoInput = document.getElementById('todo-input');
todoInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && todoInput.value) {
        insertTodo(todoInput.value);
        processTodoList();
        todoInput.value = '';
    }
});

setInterval(function(){
    const random = Math.floor(Math.random() * bg.length);
    main.style.backgroundImage = `url(images/${bg[random]})`;
}, 1000 * 60 * 5);

const clearTodoBtn = document.querySelector('.mini-btn');
clearTodoBtn.addEventListener('click', clearTodoHandler);
