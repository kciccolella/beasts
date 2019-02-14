function App() {

  var todos = [];
  var ul = document.getElementById('todolist');

  // Functions
  function addTodo(position, element, marker, timesNested) {
    var counter = arguments[4] || 0;

    if (counter === timesNested) {
      position.appendChild(createTodo(element, marker));
    } else if (counter < timesNested) {
      counter++;
      var i = position.children.length - 1; 
      addTodo(position.children[i].children[4], element, marker, timesNested, counter);
      counter--;
    }

    scanAndMapLi();
  };

  function addNestedTodo(element) {
    var ulWithinLi = element.parentElement.children[4];
    ulWithinLi.appendChild(createTodo(''));
    element.parentNode.lastChild.lastChild.children[1].focus();
  };

  function createTodo(element) {
    var input = document.createElement('input');
    input.class = 'todoItem';
    input.classList = arguments[1] || '';
    input.type = 'text';
    input.value = input.name = element;
    var addButton = document.createElement('input');
    addButton.class = 'addButton';
    addButton.type = 'button';
    addButton.value = '+';
    var markButton = document.createElement('input');
    markButton.class = 'markButton';
    markButton.type = 'button';
    markButton.value = '-';
    var deleteButton = document.createElement('input');
    deleteButton.class = 'deleteButton';
    deleteButton.type = 'button';
    deleteButton.value = 'x';
    var ulWithinLi = document.createElement('ul');
    var li = document.createElement('li');
    li.appendChild(addButton);
    li.appendChild(input);
    li.appendChild(markButton);
    li.appendChild(deleteButton);
    li.appendChild(ulWithinLi);
    return li;
  };

  function deleteTodo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    scanAndMapLi();
  };

  function editTodo(element, elementValue) {
    element.name = elementValue;
    scanAndMapLi();
  };

  function forEachTodo(element, callback) {
    var counter = arguments[2] || 0;

    for (var i = 0; i < element.children.length; i++) {
      if (element.children[i].children[1]) {
        callback([element.children[i].children[1].value, element.children[i].children[1].className, counter]);
      } 

      if (element.children[i].children[4].children.length > 0) {
        counter++;
        forEachTodo(element.children[i].children[4], callback, counter);
        counter--;
      }
    }
  };

  function markTodo(element) {
    element.previousSibling.classList.toggle('marked');

    if (element.parentElement.children[4].children[0]) {
      for (var i = 0; i < element.parentElement.children[4].children.length; i++) {
        markTodo(element.parentElement.children[4].children[i].children[2]);
      }
    }

    scanAndMapLi();
  };

  function populateTodos() {
    todos = store('myTodos');
    todos.forEach(function(e) {
      addTodo(ul, e[0], e[1], e[2]);
    });
  };

  function scanAndMapLi() {
    todos = [];
    forEachTodo(ul, function(element) {
      todos.push(element);
    });
    store('myTodos', todos);
  };

  function store(namespace, data) {
    if (arguments.length > 1) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    } else {
      var store = localStorage.getItem(namespace);
      return (store && JSON.parse(store)) || [];
    }
  };

  function updateTodo(element) {
    if (element.target.value.trim() !== '' && element.key === 'Enter') {
      editTodo(element.target, element.target.value.trim());

      if (element.target.parentElement.nextSibling) {
        element.target.blur();
      } else {
        element.target.closest('ul').appendChild(createTodo('', '')).focus();
        element.target.parentElement.nextSibling.children[1].focus();
      }
      
    } else if (element.target.value.trim() === '' && element.key === 'Escape') {
      deleteTodo(element.target);
    } else if (element.target.value.trim() !== '' && element.key === 'Escape') {
      element.target.value = element.target.name;
    }
  };

  
  // Eventlisteners
  document.getElementById('inputtodo').addEventListener('keyup', function(event) {
    if(event.target.value.trim() !== '' && event.key === 'Enter') {
      addTodo(ul, event.target.value.trim(), '', 0);
      event.target.value = '';
    } else if(event.target.value.trim() !== '' && event.key === 'Escape') {
      event.target.value = '';
    }
  });

  ul.addEventListener('keyup', function(event) {
    updateTodo(event);
  });

  ul.addEventListener('click', function(event) {
    if (event.target.class === 'deleteButton') {
      deleteTodo(event.target);
    }
  });

  ul.addEventListener('click', function(event) {
    if (event.target.class === 'markButton') {
      markTodo(event.target);
      event.target.blur();
    }
  });

  ul.addEventListener('click', function(event) {
    if (event.target.class === 'addButton') {
      addNestedTodo(event.target);
    }
  });

  document.getElementById('clear').addEventListener('click', function(event) {
    document.querySelectorAll('.marked').forEach(function(e) {
      deleteTodo(e);
    });
  });


  // IIFEs
  (function() {
    if (store('myTodos').length !== 0) {
      populateTodos();
    }
  })();

};

App();