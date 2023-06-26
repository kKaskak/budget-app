// --- Accessing elements from html
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income-tracker");
const expenseEl = document.querySelector("#expense-tracker");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income-tracker .list");
const expenseList = document.querySelector("#expense-tracker .list");
const allList = document.querySelector("#all .list");
const lists = document.querySelectorAll(".list");

// --- Tabs
const incomeBtn = document.querySelector(".tab1");
const expenseBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

// --- Input Btns
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.querySelector("#expense-title-input");
const expenseAmount = document.querySelector("#expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.querySelector("#income-title-input");
const incomeAmount = document.querySelector("#income-amount-input");

// ---  Necessary Variables

// let ENTRY_LIST = [];
let ENTRY_LIST;
let [balance, income, outcome] = [0, 0, 0];
let [deleteIcon, editIcon] = ["fas fa-trash", "far fa-edit"];

ENTRY_LIST = JSON.parse(localStorage.getItem("entry-list")) || [];
updateUI();

// --- expenseBtn event listener

expenseBtn.addEventListener("click", function () {
  show(expenseEl);
  hide([incomeEl, allList]);
  active(expenseBtn);
  inactive([incomeBtn, allBtn]);
});
// --- incomeBtn event listener

incomeBtn.addEventListener("click", function () {
  show(incomeEl);
  hide([expenseEl, allList]);
  active(incomeBtn);
  inactive([expenseBtn, allBtn]);
});
// --- expenseBtn event listener

allBtn.addEventListener("click", function () {
  show(allList);
  hide([incomeEl, expenseEl]);
  active(allBtn);
  inactive([incomeBtn, expenseBtn]);
});

// --- add expense event listener
addExpense.addEventListener("click", budgetOut);

// --- add income event listener
addIncome.addEventListener("click", budgetIn);

// lists event listener
lists.forEach((list) => {
  list.addEventListener("click", function (e) {
    if (e.target.localName !== "i") return;
    let targetBtn = e.target.attributes.class.value;
    let entry = e.target.parentNode.parentNode;
    let targetID = entry.attributes.id.value;

    if (targetBtn === editIcon) {
      editEntry(targetID);
    } else if (targetBtn === deleteIcon) {
      deleteEntry(targetID);
    }
  });
});
// delete Entry function
function deleteEntry(targetID) {
  ENTRY_LIST.splice(targetID, 1);
  updateUI();
}
// edit entry function
function editEntry(targetID) {
  console.log(ENTRY_LIST[targetID].amount);
  console.log(ENTRY_LIST[targetID].title);
  console.log(ENTRY_LIST[targetID].type);

  let targetType = ENTRY_LIST[targetID].type;
  let targetAmount = ENTRY_LIST[targetID].amount;
  let targetTitle = ENTRY_LIST[targetID].title;

  if (targetType === "income") {
    incomeAmount.value = targetAmount;
    incomeTitle.value = targetTitle;
  } else if (targetType == "expense") {
    expenseAmount.value = targetAmount;
    expenseTitle.value = targetTitle;
  }
  deleteEntry(targetID);
}
// --- addexpense/ addincome enter key element
document.addEventListener("keypress", function (e) {
  if (e.key !== " Enter") return;
  budgetOut(e);
  budgetIn(e);
});

// --- budgetOut function
function budgetOut(e) {
  e.preventDefault();
  if (!expenseTitle.value || !expenseAmount.value) return;

  let expense = {
    type: "expense",
    title: expenseTitle.value,
    amount: parseInt(expenseAmount.value), // parseInt() converts strings to numbers
  };
  ENTRY_LIST.push(expense);
  updateUI();
  clearInput([expenseTitle, expenseAmount]);
}

// --- budgetIn function
function budgetIn(e) {
  e.preventDefault();
  if (!incomeAmount.value || !incomeTitle.value) return;
  let income = {
    type: "income",
    title: incomeTitle.value,
    amount: parseFloat(incomeAmount.value), // parseInt() converts strings to numbers
  };
  ENTRY_LIST.push(income);
  updateUI();
  clearInput([incomeTitle, incomeAmount]);
}

// --- updateUI function
function updateUI() {
  income = calculateTotal("income", ENTRY_LIST);
  outcome = calculateTotal("expense", ENTRY_LIST);
  balance = Math.abs(calculateBalance(income, outcome));

  let sign = income >= outcome ? "$" : "-$";

  // updating the UI
  balanceEl.innerHTML = `<p>${sign}</p><p>${balance}</p>`;
  incomeTotalEl.innerHTML = `<p>$</p><p>${income}</p>`;
  outcomeTotalEl.innerHTML = `<p>$</p><p>${outcome}</p>`;

  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach(function (entry, index) {
    if (entry.type === "expense") {
      showEntry(expenseList, entry.type, entry.title, entry.amount, index);
    } else if (entry.type === "income") {
      showEntry(incomeList, entry.type, entry.title, entry.amount, index);
    }

    showEntry(allList, entry.type, entry.title, entry.amount, index);
    updateChart(income, outcome);

    localStorage.setItem("entry-list", JSON.stringify(ENTRY_LIST));
  });
}

// --- clear element function
function clearElement(elements) {
  elements.forEach((element) => {
    element.innerHTML = "";
  });
}

// --- show entry function
function showEntry(list, type, title, amount, id) {
  const entry = `<li id="${id}" class="${type}">
                  <div class="entry"> ${title}: $${amount}</div>   
                  <div class="action">
                    <i class="far fa-edit"></i>
                    <i class="fas fa-trash"></i>
                  </div>
                  </li>`;
  const position = "afterbegin";
  list.insertAdjacentHTML(position, entry);
}

// ---- clear input function
function clearInput(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
}
// calculate total function
function calculateTotal(type, list) {
  let sum = 0;
  list.forEach((entry) => {
    if (entry.type === type) {
      sum += entry.amount;
    }
  });
  return sum;
}
// --- calculate balance function
function calculateBalance(income, outcome) {
  return income - outcome;
}

// --- show function
function show(element) {
  element.classList.remove("hide");
}

// --- hide function
function hide(elements) {
  elements.forEach((element) => {
    element.classList.add("hide");
  });
}
// --- active function
function active(element) {
  element.classList.add("active");
}
// --- inactive function
function inactive(elements) {
  elements.forEach((element) => {
    element.classList.add("inactive");
  });
}
