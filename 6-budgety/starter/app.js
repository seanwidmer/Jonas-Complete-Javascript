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
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
      if (type === 'exp') {
        newItem = new Expense(id, description, value);
      } else if (type === 'inc') {
        newItem = new Income(id, description, value);
      }

      // Update data object with new item and increment totals
      data.allItems[type].push(newItem);

      // Return new element
      return newItem;

      //data.totals[type] += value;
    },

    calculateBudget: function() {
      // Calculate total income and expenses
      calculateBudget('exp');
      calculateBudget('inc');

      // Calculate budget: income - expenses

      // Calculate percentage of income that we spent
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
    expensesContainer: '.expenses__list'
  };

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Will be either "inc" or "exp"
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(item, type) {
      var html;
      var newHtml;
      var element;

      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="expense-%id"><div class="item__description">%description</div><div class="right clearfix"><div class="item__value">%value</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with actual data
      newHtml = html
        .replace('%id%', item.id)
        .replace('%description%', item.description)
        .replace('%value%', item.value);

      // Insert the HTM into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
  };

  var updateBudget = function() {
    // 1. Calculate the budget
    // 2. Return the budget
    // 3. Display the budget on the user interface
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
    }
  };
  return {
    init: function() {
      console.log('Application has started');
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
