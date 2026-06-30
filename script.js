// Global selectors
const newListButton = document.querySelector('.btnCreateNewList');
const modalWindow = document.querySelector('.modalWindow-overlay');
const btnCancel = document.querySelector('.btnCancelList');
const btnCreate = document.querySelector('.btnCreateList');
const newListName = document.querySelector('.newListName');
const listsContainer = document.querySelector('.listsContainer');
const taskModalWindow = document.querySelector('.taskModalWindow');
const taskModalTitle = document.querySelector('.taskModalTitle');
const btnBack = document.querySelector('.btnBack');
const tasksContainer = document.querySelector('.tasksContainer');

// New selectors for the input tasks
const newTaskName = document.querySelector('.newTaskName');
const btnCreateTask = document.querySelector('.btnCreateTask');

// Applications data
let lists = JSON.parse(localStorage.getItem('todo-lists')) || [];
let activeList = null;

// Displaying the main lists along with the delete button
function renderLists(){
    listsContainer.innerHTML = '';
    lists.forEach(function(list){
        const listElement = document.createElement('div');
        listElement.classList.add('listCard');
        listElement.dataset.id = list.id;

        // Adding a span for the text list
        const listText = document.createElement('span');
        listText.innerText = list.name;
        listElement.appendChild(listText);

        // Adding the delete button to the list
        const btnDeleteList = document.createElement('button');
        btnDeleteList.innerHTML = '<i class="fa-solid fa-rectangle-xmark"></i>'; // Corectat un mic typo "= fa-rect..."
        btnDeleteList.classList.add('btnDeleteListMain');
        listElement.appendChild(btnDeleteList);

        listsContainer.appendChild(listElement);
    });
}

// Displaying the tasks from the open list
function renderTasks() {
    tasksContainer.innerHTML = ''; 
    
    if (activeList && activeList.tasks) {
        activeList.tasks.forEach(function(task, index) {
            const taskElement = document.createElement('div');
            taskElement.classList.add('taskItem');

            const taskTextSpan = document.createElement('span');
            taskTextSpan.innerText = task;
            taskElement.appendChild(taskTextSpan);

            const btnContainer = document.createElement('div');
            btnContainer.classList.add('taskActions');

            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = '<i class="fa-solid fa-rectangle-xmark"></i>';
            btnDelete.classList.add('btnDeleteTask');
            btnDelete.dataset.index = index;
            btnContainer.appendChild(btnDelete);

            taskElement.appendChild(btnContainer);
            tasksContainer.appendChild(taskElement);
        });
    }
}

// Initial rendering of saved lists
renderLists();

// Events for the create list modal
newListButton.addEventListener('click', function(){
    modalWindow.classList.remove('hidden'); 
});

btnCancel.addEventListener('click', function(){
    modalWindow.classList.add('hidden');
});

btnCreate.addEventListener('click', function(){
    if(newListName.value.trim() !== "") {
        const myLists = {
            id: Date.now(),
            name: newListName.value,
            tasks: []
        }
        lists.push(myLists); 
        localStorage.setItem('todo-lists', JSON.stringify(lists));
        renderLists();
        modalWindow.classList.add('hidden');
        newListName.value = '';
    }
});

// Click event for lists container to  to manage opening vs delete list
listsContainer.addEventListener('click', function(e) {
    const deleteBtn = e.target.closest('.btnDeleteListMain');
    
    if (deleteBtn) {
        e.stopPropagation(); 
        
        const listCard = deleteBtn.closest('.listCard');
        const listId = Number(listCard.dataset.id);
        
        lists = lists.filter(function(list) {
            return list.id !== listId;
        });
        
        localStorage.setItem('todo-lists', JSON.stringify(lists));
        renderLists();
        return; 
    }

    const clickedElement = e.target.closest('.listCard');

    if (clickedElement) {
        const listId = Number(clickedElement.dataset.id);
        
        activeList = lists.find(function(list) {
            return list.id === listId;
        });

        taskModalTitle.innerText = activeList.name;
        taskModalWindow.classList.remove('hidden'); 
        document.querySelector('.container').classList.add('hidden');
        
        renderTasks();
    }
});

// Add back button to return the lists on the primary container 
btnBack.addEventListener('click', function() {
    taskModalWindow.classList.add('hidden');
    activeList = null; 
    document.querySelector('.container').classList.remove('hidden');
});

// Add task from input
btnCreateTask.addEventListener('click', function() {
    const taskText = newTaskName.value.trim();

    if (taskText !== "") {
        activeList.tasks.push(taskText);
        localStorage.setItem('todo-lists', JSON.stringify(lists));
        renderTasks();
        newTaskName.value = '';
    }
});

// Delete Task inside the open list
tasksContainer.addEventListener('click', function(e) {
    const deleteBtn = e.target.closest('.btnDeleteTask');

    if (deleteBtn) {
        const taskIndex = Number(deleteBtn.dataset.index);
        activeList.tasks.splice(taskIndex, 1);
        localStorage.setItem('todo-lists', JSON.stringify(lists));
        renderTasks();
    }
});