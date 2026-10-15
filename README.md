
# SpendWise — Interactive Budget Tracker

## Project Overview

SpendWise is a personal budgeting application built with HTML, CSS, and JavaScript. It helps users record expenses, monitor monthly spending, and make better budgeting decisions.

This week's assignment focused on making the existing SpendWise project interactive using JavaScript decision-making, arrays, loops, DOM manipulation, and event listeners.

## Features and Improvements

The following improvements were implemented:

- Added a form for setting and updating the monthly budget.
- Added an expense form for entering an expense name, amount, category, and date.
- Displayed the monthly budget, total expenses, and remaining balance.
- Added budget progress feedback and spending warnings.
- Stored multiple expense records in an array.
- Displayed expenses dynamically in a table.
- Added category filtering and expense deletion.
- Displayed spending totals by category.
- Saved the budget and expense records in browser local storage.
- Added input validation and responsive styling for different screen sizes.

## How Conditionals Are Used

Conditional statements (`if`, `else if`, and `else`) help the application make decisions based on user input and expense data.

For example, the application checks whether spending exceeds the monthly budget, reaches the budget limit, approaches 80% of the budget, or remains below the warning level.

Conditional statements also validate expense amounts, expense names, categories, and dates before records are added.

## How Arrays Are Used

The `expenses` array stores multiple expense objects. Each object contains an ID, expense name, amount, category, and date.

The `push()` method adds a new expense to the array, while `filter()` is used to select expenses by category and remove deleted records.

Arrays allow the application to manage multiple records instead of relying on separate variables for each expense.

## How Loops Are Used

`for...of` loops process the expense records to calculate monthly spending, filter transactions, and generate category totals.

Loops also create the expense table rows and category breakdown dynamically. This allows the application to display multiple records efficiently.

## How the DOM Is Updated

DOM manipulation allows JavaScript to update the webpage without requiring a full page reload.

The application uses methods such as `getElementById()`, `createElement()`, `appendChild()`, `replaceChildren()`, and `textContent`.

When expenses are added or deleted, the dashboard updates the spending totals, remaining balance, progress bar, category breakdown, and transaction table.

## How User Interactions Are Handled

Event listeners respond to user actions.

- The budget form's `submit` event updates the monthly budget.
- The expense form's `submit` event validates and records expenses.
- The category filter's `change` event displays matching records.
- The transaction table's `click` event handles expense deletion through event delegation.

The application uses `preventDefault()` to stop forms from reloading the page.

## Data Storage

Expense records and the monthly budget are saved in browser `localStorage`. The application loads saved data when it starts, allowing users to continue working with their records in the same browser.

Local storage is browser-specific and is not a shared online database.

## Challenges and Solutions

Potential challenges and their solutions include:

1. **Updating several dashboard sections:** A common rendering function was created to refresh the totals, budget status, transaction table, category totals, and spending tips.

2. **Handling invalid user input:** Validation checks were added to prevent empty expense names, invalid amounts, missing categories, and invalid dates.

3. **Displaying different spending scenarios:** Conditional statements were used to show appropriate messages when spending is within budget, approaches the limit, or exceeds it.

4. **Keeping records after refreshing the page:** Browser local storage was implemented to save and reload the budget and expense records.

5. **Displaying filtered records:** Array filtering allows users to view expenses by category while keeping the underlying records available.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser DOM API
- Browser localStorage API
- Git and GitHub

## How to Run the Project

1. Clone or download the project repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a web browser, or use the VS Code Live Server extension.
4. Set a monthly budget.
5. Add expenses and test the dashboard functionality.

## Conclusion

SpendWise demonstrates how JavaScript can make a budgeting application interactive. It combines conditional statements, arrays, loops, DOM manipulation, and event listeners to process user input and display updated information directly on the webpage.
