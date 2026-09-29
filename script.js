let budget = 50000;
let expenses = 15000;

let userBudget = Number(prompt("Enter your budget:"));
let userExpenses = Number(prompt("Enter your total expenses:"));

function calculateBalance(budget, expenses) {
    return budget - expenses;
}

let remainingBalance = calculateBalance(userBudget, userExpenses);

console.log("Budget:", userBudget);
console.log("Expenses:", userExpenses);
console.log("Remaining Balance:", remainingBalance);