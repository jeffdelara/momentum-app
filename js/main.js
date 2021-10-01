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
                "ijen-crater.jpg"];

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
        

        todos = getTodos();

        setTimeout(function(){
            page2.classList.add('hide');
            page3.classList.toggle('hide');

            quoteDiv.innerHTML = `"${quotes.content}"<br><i class="author">${quotes.author}</i>`;
            focusDiv.innerHTML = !todos ? `Add your focus.` : todos[0];

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
        todos.push(focus.value);
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
        console.log("Create todos");
    }

    async function getQuotes()
    {
        const data = await fetch('https://api.quotable.io/random');
        const quote = await data.json();
        quotes.content = quote.content;
        quotes.author = quote.author;
    }

})();
