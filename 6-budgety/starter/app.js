// Budget Controller
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });

    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    },
    budget: 0,
    percentage: -1
  };

  // Return an object that contains all of our public methods
  return {
    addItem: function(type, description, value) {
      var newItem, id;

      // Create new ID
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      // Create new item based on type
      if (type === 'expense') {
        newItem = new Expense(id, description, value);
      } else if (type === 'income') {
        newItem = new Income(id, description, value);
      }

      // Update data object with new item and increment totals
      data.allItems[type].push(newItem);

      // Return new element
      return newItem;

      //data.totals[type] += value;
    },

    deleteItem: function(type, ID) {
      var ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      var index = ids.indexOf(ID);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      // Calculate total income and expenses
      calculateTotal('expense');
      calculateTotal('income');

      // Calculate budget: income - expenses
      data.budget = data.totals.income - data.totals.expense;

      // Calculate percentage of income that we spent
      if (data.totals.income > 0) {
        data.percentage = Math.round(
          (data.totals.expense / data.totals.income) * 100
        );
      } else {
        data.percentage = -2;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalIncome: data.totals.income,
        totalExpenses: data.totals.expense,
        percentage: data.percentage
      };
    },

    testing: function() {
      console.log(data);
    }
  };
})();

// UI Controller
var UIController = (function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'
  };

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Will be either "income" or "expense"
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(item, type) {
      var html;
      var newHtml;
      var element;

      // Create HTML string with placeholder text
      if (type === 'income') {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'expense') {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with actual data
      newHtml = html
        .replace('%id%', item.id)
        .replace('%description%', item.description)
        .replace('%value%', item.value);

      if (type === 'expense') {
        newHtml = newHtml.replace('%percentage%', item.percentage);
      }

      // Insert the HTM into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      var element = document.getElementById(selectorID);

      element.parentNode.removeChild(element);
    },

    getDOMstrings: function() {
      return DOMstrings;
    },

    clearFields: function() {
      var fields;
      var fieldsArray;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
      );
      // Use slice to convert list in fields to an array so we can loop over them
      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, array) {
        current.value = '';
      });

      // Reset focus to first field
      fieldsArray[0].focus();
    },

    displayBudget: function(object) {
      document.querySelector(DOMstrings.budgetLabel).textContent =
        object.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent =
        object.totalIncome;
      document.querySelector(DOMstrings.expenseLabel).textContent =
        object.totalExpense;

      if (object.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          object.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    }
  };
})();

// Global app controller
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document
      .querySelector(DOM.container)
      .addEventListener('click', ctrlDeleteItem);
  };

  var updateBudget = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the user interface
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    //1. Calculate percentages
    //2. Read percentages from budger controler
    //3. Update the UI with the new percentages
  };

  var ctrlAddItem = function() {
    // 1. Get input data
    var input;
    var newItem;

    input = UICtrl.getinput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add new item to user interface
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate and update the budget
      updateBudget();

      //6. Calculate and update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // Format of id is expense-id
      var splitID = itemID.split('-');
      var type = splitID[0];
      var ID = parseInt(splitID[1]);

      //1. Delete item from data structure
      budgetCtrl.deleteItem(type, ID);
      //2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      //3. Update and show the budget
      updateBudget();

      //4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log('Application has started');
      UICtrl.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpenses: 0,
        percentage: 0
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
