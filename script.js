
"use strict";

// ============================================
// 1. SELECT HTML ELEMENTS (DOM MANIPULATION)
// ============================================

const budgetForm = document.getElementById("budgetForm");
const budgetInput = document.getElementById("monthlyBudget");
const expenseForm = document.getElementById("expenseForm");
const expenseTitleInput = document.getElementById("expenseTitle");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseCategoryInput = document.getElementById("expenseCategory");
const expenseDateInput = document.getElementById("expenseDate");
const categoryFilter = document.getElementById("categoryFilter");

const budgetTotalElement = document.getElementById("budgetTotal");
const totalSpentElement = document.getElementById("totalSpent");
const remainingBalanceElement = document.getElementById("remainingBalance");
const budgetPercentageElement = document.getElementById("budgetPercentage");
const budgetProgress = document.getElementById("budgetProgress");
const budgetProgressBar = document.getElementById("budgetProgressBar");
const budgetMessage = document.getElementById("budgetMessage");
const formMessage = document.getElementById("formMessage");
const categorySummary = document.getElementById("categorySummary");
const expenseTableBody = document.getElementById("expenseTableBody");
const expenseCountElement = document.getElementById("expenseCount");
const tableMessage = document.getElementById("tableMessage");
const spendingTip = document.getElementById("spendingTip");

// ============================================
// 2. ARRAYS AND APPLICATION DATA
// ============================================

// The array stores multiple expense objects.
// Each object represents one expense record.

let expenses = [];
let monthlyBudget = 15000;
let nextExpenseId = 1;

// Use the current local calendar date rather than UTC.
function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentMonth() {
  return getLocalDateString().slice(0, 7);
}

// Display currency in Kenyan shillings.
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Only include expenses belonging to the current month.
function getMonthlyExpenses() {
  const currentMonth = getCurrentMonth();

  return expenses.filter(function (expense) {
    return expense.date.slice(0, 7) === currentMonth;
  });
}

// ============================================
// 3. LOAD AND SAVE DATA
// ============================================

function loadData() {
  try {
    const savedData = localStorage.getItem("spendwiseData");

    if (savedData) {
      const data = JSON.parse(savedData);

      if (
        data &&
        Array.isArray(data.expenses) &&
        typeof data.monthlyBudget === "number" &&
        Number.isFinite(data.monthlyBudget) &&
        data.monthlyBudget >= 0
      ) {
        const validExpenses = data.expenses.filter(function (expense) {
          return (
            expense &&
            Number.isSafeInteger(expense.id) &&
            expense.id > 0 &&
            typeof expense.title === "string" &&
            expense.title.trim().length > 0 &&
            expense.title.length <= 80 &&
            typeof expense.amount === "number" &&
            Number.isFinite(expense.amount) &&
            expense.amount > 0 &&
            typeof expense.category === "string" &&
            typeof expense.date === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(expense.date) &&
            Number.isFinite(Date.parse(expense.date + "T00:00:00")) &&
            expense.date === expense.date &&
            [
              "Food", "Transport", "Rent", "Utilities",
              "Education", "Health", "Shopping", "Other"
            ].includes(expense.category)
          );
        });

        expenses = validExpenses;

        // Ignore duplicate IDs if saved data has been edited.
        const uniqueIds = new Set();
        expenses = expenses.filter(function (expense) {
          if (uniqueIds.has(expense.id)) {
            return false;
          }

          uniqueIds.add(expense.id);
          return true;
        });

        monthlyBudget = data.monthlyBudget;

        // Generate a new ID greater than every existing ID.
        for (const expense of expenses) {
          if (expense.id >= nextExpenseId) {
            nextExpenseId = expense.id + 1;
          }
        }
      }
    }
  } catch (error) {
    console.error("Could not load saved SpendWise data:", error);
    expenses = [];
    monthlyBudget = 15000;
    nextExpenseId = 1;
  }
}

function saveData() {
  try {
    localStorage.setItem(
      "spendwiseData",
      JSON.stringify({
        monthlyBudget: monthlyBudget,
        expenses: expenses
      })
    );

    return true;
  } catch (error) {
    console.error("Could not save SpendWise data:", error);
    return false;
  }
}

// ============================================
// 4. DECISION MAKING WITH CONDITIONALS
// ============================================

function updateBudgetStatus(totalSpent) {
  // Conditional 1: no budget has been set.
  if (monthlyBudget <= 0) {
    budgetMessage.textContent =
      "Please set a budget greater than zero to monitor your spending.";

    budgetProgressBar.style.width = "0%";
    budgetProgressBar.className = "progress-fill";
    budgetPercentageElement.textContent = "—";
    budgetProgress.setAttribute("aria-valuenow", "0");

    return;
  }

  const percentage = (totalSpent / monthlyBudget) * 100;
  const displayedPercentage = Math.round(percentage);

  // A progress bar cannot visually exceed 100%, but the actual
  // percentage and remaining balance can show overspending.
  const barPercentage = Math.min(percentage, 100);

  budgetProgressBar.style.width = `${barPercentage}%`;
  budgetPercentageElement.textContent = `${displayedPercentage}%`;
  budgetProgress.setAttribute(
    "aria-valuenow",
    String(Math.min(displayedPercentage, 100))
  );

  // Conditional 2: spending exceeds the available budget.
  if (totalSpent > monthlyBudget) {
    budgetMessage.textContent =
      `You have exceeded your budget by ${formatCurrency(
        totalSpent - monthlyBudget
      )}. Review your spending.`;

    budgetMessage.className = "budget-message danger";
    budgetProgressBar.className = "progress-fill danger";

  // Conditional 3: exactly the whole budget has been spent.
  } else if (totalSpent === monthlyBudget) {
    budgetMessage.textContent =
      "You have used your entire monthly budget. Avoid extra spending.";

    budgetMessage.className = "budget-message warning";
    budgetProgressBar.className = "progress-fill warning";

  // Conditional 4: at least 80% has been spent.
  } else if (percentage >= 80) {
    budgetMessage.textContent =
      `Warning: you have used ${displayedPercentage}% of your budget.`;

    budgetMessage.className = "budget-message warning";
    budgetProgressBar.className = "progress-fill warning";

  // Conditional 5: spending remains below 80%.
  } else {
    budgetMessage.textContent =
      "Good progress! Your spending is within your budget.";

    budgetMessage.className = "budget-message";
    budgetProgressBar.className = "progress-fill";
  }
}

// ============================================
// 5. UPDATE DASHBOARD USING THE DOM
// ============================================

function renderDashboard() {
  const monthlyExpenses = getMonthlyExpenses();
  let totalSpent = 0;

  // LOOP: process every expense for the current month.
  for (const expense of monthlyExpenses) {
    totalSpent += expense.amount;
  }

  const remaining = monthlyBudget - totalSpent;

  budgetTotalElement.textContent = formatCurrency(monthlyBudget);
  totalSpentElement.textContent = formatCurrency(totalSpent);
  remainingBalanceElement.textContent = formatCurrency(remaining);

  // Conditional: display the remaining balance appropriately.
  if (remaining < 0) {
    remainingBalanceElement.style.color = "#c0393b";
  } else {
    remainingBalanceElement.style.color = "";
  }

  updateBudgetStatus(totalSpent);
  renderExpenses();
  renderCategorySummary(monthlyExpenses);
  renderSpendingTip(totalSpent);
}

// ============================================
// 6. DISPLAY EXPENSES AND PROCESS THE ARRAY
// ============================================

function renderExpenses() {
  const selectedCategory = categoryFilter.value;
  const monthlyExpenses = getMonthlyExpenses();
  const filteredExpenses = [];

  // LOOP: select records that match the chosen category.
  for (const expense of monthlyExpenses) {
    if (
      selectedCategory === "All" ||
      expense.category === selectedCategory
    ) {
      filteredExpenses.push(expense);
    }
  }

  // Show the most recently dated expenses first.
  filteredExpenses.sort(function (a, b) {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }

    return b.id - a.id;
  });

  expenseCountElement.textContent = String(monthlyExpenses.length);
  expenseTableBody.replaceChildren();

  // CONDITIONAL: handle an empty result.
  if (filteredExpenses.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.className = "empty-state";
    cell.textContent =
      selectedCategory === "All"
        ? "No expenses recorded this month. Add your first expense above."
        : `No ${selectedCategory.toLowerCase()} expenses found this month.`;

    row.appendChild(cell);
    expenseTableBody.appendChild(row);
    tableMessage.textContent = "";
    return;
  }

  // LOOP: create a table row for each matching expense.
  for (const expense of filteredExpenses) {
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    titleCell.textContent = expense.title;

    const categoryCell = document.createElement("td");
    const categoryTag = document.createElement("span");
    categoryTag.className = "category-tag";
    categoryTag.textContent = expense.category;
    categoryCell.appendChild(categoryTag);

    const dateCell = document.createElement("td");
    dateCell.textContent = expense.date;

    const amountCell = document.createElement("td");
    amountCell.textContent = formatCurrency(expense.amount);

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
      "aria-label",
      `Delete expense ${expense.title}`
    );

    // Attach the expense ID to the button for deletion.
    deleteButton.dataset.expenseId = String(expense.id);
    actionCell.appendChild(deleteButton);

    row.append(
      titleCell,
      categoryCell,
      dateCell,
      amountCell,
      actionCell
    );

    expenseTableBody.appendChild(row);
  }

  tableMessage.textContent =
    `Showing ${filteredExpenses.length} of ${monthlyExpenses.length} expenses for this month.`;
}

// ============================================
// 7. CALCULATE CATEGORY TOTALS USING LOOPS
// ============================================

function renderCategorySummary(monthlyExpenses) {
  const categoryTotals = {};

  // LOOP: group the amounts by category.
  for (const expense of monthlyExpenses) {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] += expense.amount;
  }

  const categories = Object.entries(categoryTotals)
    .sort(function (a, b) {
      return b[1] - a[1];
    });

  categorySummary.replaceChildren();

  if (categories.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent =
      "Your category totals will appear here.";
    categorySummary.appendChild(emptyMessage);
    return;
  }

  const total = monthlyExpenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);

  // LOOP: display each category and its spending bar.
  for (const [category, amount] of categories) {
    const item = document.createElement("div");
    item.className = "category-item";

    const top = document.createElement("div");
    top.className = "category-top";

    const name = document.createElement("span");
    name.textContent = category;

    const value = document.createElement("strong");
    value.textContent = formatCurrency(amount);

    top.append(name, value);

    const track = document.createElement("div");
    track.className = "category-track";

    const fill = document.createElement("div");
    fill.className = "category-fill";

    const percentage = total > 0 ? (amount / total) * 100 : 0;
    fill.style.width = `${percentage}%`;

    track.appendChild(fill);
    item.append(top, track);
    categorySummary.appendChild(item);
  }
}

// ============================================
// 8. SMART SPENDING TIPS USING CONDITIONALS
// ============================================

function renderSpendingTip(totalSpent) {
  if (monthlyBudget <= 0) {
    spendingTip.textContent =
      "Set a monthly budget to receive useful spending feedback.";
  } else if (totalSpent > monthlyBudget) {
    spendingTip.textContent =
      "Your expenses have exceeded your budget. Review non-essential spending and plan your next purchases carefully.";
  } else if (totalSpent === monthlyBudget) {
    spendingTip.textContent =
      "Your budget is fully used. Avoid further spending unless you adjust your budget.";
  } else if (totalSpent / monthlyBudget >= 0.8) {
    spendingTip.textContent =
      "You are approaching your budget limit. Prioritize essential expenses and postpone unnecessary purchases.";
  } else if (totalSpent === 0) {
    spendingTip.textContent =
      "Record your expenses regularly to understand where your money goes.";
  } else {
    spendingTip.textContent =
      "Your spending is within your budget. Continue tracking expenses and consider saving part of your remaining balance.";
  }
}

// ============================================
// 9. HANDLE BUDGET FORM SUBMISSION
// ============================================

budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newBudget = Number(budgetInput.value);

  // Validate the budget before updating the data.
  if (!Number.isFinite(newBudget) || newBudget <= 0) {
    alert("Please enter a valid budget greater than zero.");
    return;
  }

  const previousBudget = monthlyBudget;
  monthlyBudget = newBudget;

  if (!saveData()) {
    monthlyBudget = previousBudget;
    alert("Your budget could not be saved. Check browser storage settings.");
    return;
  }

  renderDashboard();
  alert("Your monthly budget has been updated successfully.");
});

// ============================================
// 10. HANDLE ADD-EXPENSE FORM SUBMISSION
// ============================================

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = expenseTitleInput.value.trim();
  const amount = Number(expenseAmountInput.value);
  const category = expenseCategoryInput.value;
  const date = expenseDateInput.value;

  // CONDITIONAL: validate required data.
  if (!title || title.length > 80) {
    showFormMessage("Enter an expense name of up to 80 characters.", "error");
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showFormMessage("Enter an amount greater than zero.", "error");
    return;
  }

  const allowedCategories = [
    "Food", "Transport", "Rent", "Utilities",
    "Education", "Health", "Shopping", "Other"
  ];

  if (!allowedCategories.includes(category)) {
    showFormMessage("Please select a valid category.", "error");
    return;
  }

  if (
    !date ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date + "T00:00:00"))
  ) {
    showFormMessage("Please select a valid expense date.", "error");
    return;
  }

  // Create an expense object and add it to the array.
  const newExpense = {
    id: nextExpenseId,
    title: title,
    amount: amount,
    category: category,
    date: date
  };

  expenses.push(newExpense);
  nextExpenseId++;

  if (!saveData()) {
    // Roll back the addition if storage fails.
    expenses.pop();
    nextExpenseId--;
    showFormMessage(
      "The expense could not be saved. Check browser storage settings.",
      "error"
    );
    return;
  }

  expenseForm.reset();
  expenseDateInput.value = getLocalDateString();

  // Refresh every part of the dashboard.
  renderDashboard();

  showFormMessage("Expense added successfully!", "success");
});

// Display form feedback without opening an alert.
function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

// ============================================
// 11. HANDLE CATEGORY FILTERING
// ============================================

categoryFilter.addEventListener("change", function () {
  renderExpenses();
});

// ============================================
// 12. HANDLE DELETE BUTTONS USING EVENT DELEGATION
// ============================================

expenseTableBody.addEventListener("click", function (event) {
  const button = event.target.closest(".delete-btn");

  if (!button || !expenseTableBody.contains(button)) {
    return;
  }

  const expenseId = Number(button.dataset.expenseId);

  const expenseToDelete = expenses.find(function (expense) {
    return expense.id === expenseId;
  });

  if (!expenseToDelete) {
    return;
  }

  // Ask for confirmation before deleting a record.
  const confirmed = window.confirm(
    `Delete "${expenseToDelete.title}"? This action cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  // Save the original array in case saving fails.
  const previousExpenses = expenses;

  expenses = expenses.filter(function (expense) {
    return expense.id !== expenseId;
  });

  if (!saveData()) {
    expenses = previousExpenses;
    renderDashboard();
    alert("The expense could not be deleted. Please try again.");
    return;
  }

  renderDashboard();
  showFormMessage("Expense deleted successfully.", "success");
});

// ============================================
// 13. INITIALIZE THE APPLICATION
// ============================================

function initializeApp() {
  loadData();

  document.getElementById("todayDate").textContent =
    new Intl.DateTimeFormat("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date());

  document.getElementById("currentYear").textContent =
    String(new Date().getFullYear());

  // Start the date input at today's date.
  expenseDateInput.value = getLocalDateString();

  // Restore the saved budget in the form.
  budgetInput.value = monthlyBudget > 0 ? String(monthlyBudget) : "";

  // Draw the dashboard using the loaded data.
  renderDashboard();
}

initializeApp();
