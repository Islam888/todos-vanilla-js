window.onload = (function () {
  let todosState = [];
  const todosContainer = document.getElementById("todos-container");
  function init() {
    const localStorageTodos = window.localStorage.getItem("localStorageTodos");
    if (localStorageTodos) {
      todosState = JSON.parse(localStorageTodos);
    }
  }
  init();
  ////////////////////////////////////////////
  function showTodos(todosState) {
    todosContainer.innerHTML = "";
    if (todosState.length) {
      todosState.map((todoItem) => {
        let todoCard = `
                <div key=${
                  todoItem.id
                } class="card mt-2 todo-card ${checkImpAndUrgAndDone(
          todoItem.important,
          todoItem.urgent,
          todoItem.done
        )}">
                    <div class="card-body justify-content-between">
                        ${
                          todoItem.done
                            ? '<input type="checkbox" aria-label="checkbox for done todos" class="done-checkbox" checked />'
                            : '<input type="checkbox" aria-label="checkbox for done todos"class="done-checkbox" />'
                        }
                        ${
                          todoItem.done
                            ? `<del><span class="text-white">${todoItem.todoText}</span></del>`
                            : `<span class="text-white">${todoItem.todoText}</span>`
                        }
                        <div class="d-flex flex-column float-right">
                          <button class="btn btn-link btn-sm btn-remove">delete</button>
                        </div>
                        
                    </div>
                </div>
                `;

        todosContainer.insertAdjacentHTML("beforeend", todoCard);
      });
    }
  }
  showTodos(todosState);
  /////////////////////////////////////
  function checkImpAndUrgAndDone(imp, urg, done) {
    if (done) {
      return "bg-secondary";
    } else if (imp && urg) {
      return "bg-danger";
    } else if (imp) {
      return "bg-success";
    } else if (urg) {
      return "bg-warning";
    } else {
      return "bg-info";
    }
  }
  /////////////////////////////////////
  const addBtn = document.getElementById("add-btn");
  addBtn.addEventListener("click", addTodo);
  function addTodo() {
    const todoInputText = document.getElementById("todo-input-text");
    const impCheckbox = document.getElementById("imp-checkbox");
    const urgCheckbox = document.getElementById("urg-checkbox");
    todosState.unshift({
      todoText: todoInputText.value,
      important: impCheckbox.checked,
      urgent: urgCheckbox.checked,
      done: false,
      id: Date.now(),
    });
    showTodos(todosState);
    updateLocalStorage(todosState);
  }
  ///////////////////////////
  function updateLocalStorage(todosState) {
    window.localStorage.setItem(
      "localStorageTodos",
      JSON.stringify(todosState)
    );
  }
  ////////////////////
  todosContainer.addEventListener("change", toggleDone);
  function toggleDone(e) {
    const doneCheckboxKey = Number(
      e.target.parentElement.parentElement.getAttribute("key")
    );
    for (const todoItem of todosState) {
      if (todoItem.id === doneCheckboxKey) {
        todoItem.done = e.target.checked;
      }
    }
    showTodos(todosState);
    updateLocalStorage(todosState);
  }
  ////
  todosContainer.addEventListener("click", deleteTodo);
  function deleteTodo(e) {
    if (e.target.classList.contains("btn-remove")) {
      const deleteBtnKey = Number(
        e.target.parentElement.parentElement.parentElement.getAttribute("key")
      );
      todosState = todosState.filter(
        (todoItem) => todoItem.id !== deleteBtnKey
      );
      showTodos(todosState);
      updateLocalStorage(todosState);
    }
  }
  const filterSection = document.getElementById('filter-section')
  filterSection.addEventListener('click', handleFilterClick)
  function handleFilterClick(e) {
    switch(e.target.id) {
      case "btn-done":
        filteredTodos = todosState.filter(todoItem => todoItem.done)
        showTodos(filteredTodos)
        break;
      case "btn-urg&imp":
        filteredTodos = todosState.filter(todoItem => todoItem.urgent && todoItem.important)
        showTodos(filteredTodos)
        break;
      case "btn-imp":
        filteredTodos = todosState.filter(todoItem => todoItem.important && !todoItem.urgent)
        showTodos(filteredTodos)
        break;
      case "btn-urg":
        filteredTodos = todosState.filter(todoItem => todoItem.urgent && !todoItem.important)
        showTodos(filteredTodos)
        break;
      case "btn-reset":
        showTodos(todosState)
        break;
    }
  }
})();
