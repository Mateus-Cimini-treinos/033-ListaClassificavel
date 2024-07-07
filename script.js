const draggableList = document.getElementById("draggable-list");
const check = document.getElementById("check");

const richestPeople = [
  "Dragon Ball", "Naruto", "One Piece", "Death Note", "Jujutsu Kaisen", "Kimetsu no Yaiba", "Vinland Saga", "Haikyuu", "Jojo", "Chainsaw Man", "Hunter x Hunter", "Blue Lock", "Dr.Stone", "Nanatsu no Taizai", "Mushoku Tensei", "RE:Zero"
];
const listItems = [];

let dragStartIndex;

function createList() {
  const newList = [...richestPeople];
  newList
    .map((person) => ({ value: person, sort: Math.random() })) // randomize list
    .sort((a, b) => a.sort - b.sort) // generate new order
    .map((person) => person.value) // retrieve original strings
    .forEach((person, index) => {
      const listItem = document.createElement("li");
      listItem.setAttribute("data-index", index);
      listItem.innerHTML = `
        <span class="number">${index + 1}</span>
        <div class="draggable" draggable="true">
          <p class="person-name">${person}</p>
          <i class="fas fa-grip-lines"></i>
        </div>
      `;
      listItems.push(listItem);
      draggableList.appendChild(listItem);
    });
  addListeners();
}

function dragStart() {
  dragStartIndex = +this.closest("li").getAttribute("data-index");
  this.closest("li").classList.add('dragging');
}

function dragEnter() {
  this.classList.add("over");
}

function dragLeave() {
  this.classList.remove("over");
}

function dragOver(e) {
  e.preventDefault(); // dragDrop is not executed otherwise
}

function dragDrop() {
  const dragEndIndex = +this.getAttribute("data-index");
  swapItems(dragStartIndex, dragEndIndex);
  this.classList.remove("over");
  listItems[dragStartIndex].classList.remove('dragging');
  listItems[dragEndIndex].classList.remove('dragging');
}

function swapItems(fromIndex, toIndex) {
  const itemOne = listItems[fromIndex].querySelector(".draggable");
  const itemTwo = listItems[toIndex].querySelector(".draggable");
  listItems[fromIndex].appendChild(itemTwo);
  listItems[toIndex].appendChild(itemOne);
}

function checkOrder() {
  listItems.forEach((listItem, index) => {
    const personName = listItem.querySelector(".draggable").innerText.trim();
    if (personName !== richestPeople[index]) listItem.classList.add("wrong");
    else {
      listItem.classList.remove("wrong");
      listItem.classList.add("right");
    }
  });
}

function touchStart() {
  dragStartIndex = +this.closest("li").getAttribute("data-index");
  this.closest("li").classList.add('dragging');
}

function touchMove(e) {
  e.preventDefault();
  const touchLocation = e.targetTouches[0];
  const element = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
  if (element && element.closest(".draggable-list li")) {
    element.closest(".draggable-list li").classList.add("over");
  }
}

function touchEnd(e) {
  e.preventDefault();
  const touchLocation = e.changedTouches[0];
  const element = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
  if (element && element.closest(".draggable-list li")) {
    const dragEndIndex = +element.closest("li").getAttribute("data-index");
    swapItems(dragStartIndex, dragEndIndex);
  }
  document.querySelectorAll(".draggable-list li").forEach((item) => item.classList.remove("over"));
  listItems[dragStartIndex].classList.remove('dragging');
  listItems[dragEndIndex].classList.remove('dragging');
}

function addListeners() {
  const draggables = document.querySelectorAll(".draggable");
  const dragListItems = document.querySelectorAll(".draggable-list li");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
    draggable.addEventListener("touchstart", touchStart, { passive: true });
    draggable.addEventListener("touchmove", touchMove, { passive: true });
    draggable.addEventListener("touchend", touchEnd, { passive: true });
  });

  dragListItems.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
}

check.addEventListener("click", checkOrder);

createList();
