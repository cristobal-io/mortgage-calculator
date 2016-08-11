/*exported totalAmortization*/
if (typeof require !== "undefined") {
  var defaults = require("lodash/object/defaults");
  var forEach = require("lodash/collection/forEach");
  var compose = require("lodash/function/compose");
  var amortization = require("./amortization.js");
}


var defaultMortgageOptions = {
    initialDeposit: 0,
    age: 18,
    monthlyIncome: 1,
    interest: 0.1,
    term: 10,
    monthlyExpenses: 0,
    settings: {
      maxAge: 65,
      personalTaxRate: 0,
      riskRate: 0.36
    }
  },
  clone = compose(JSON.parse, JSON.stringify);

function calculateMortgage(options) {

  // add missing parameters.
  options = defaults(clone(options || {}), defaultMortgageOptions);
  var settings =
    defaults(clone(options.settings || {}), defaultMortgageOptions.settings);

  // prevent non desired values
  forEach(options, function (n, key) {
    if (n < defaultMortgageOptions[key] || isNaN(n)) {
      n = defaultMortgageOptions[key];
      options[key] = defaultMortgageOptions[key];
    }
  });

  if (+options.monthlyExpenses > +options.monthlyIncome) {
    options.monthlyExpenses = options.monthlyIncome;
  }

  // economic formula for maximum pay.
  var findMaxPay = function (monthlyIncome, monthlyExpenses) {
    var maxPay = (monthlyIncome - monthlyExpenses) * settings.riskRate;

    return maxPay;
  };

  // economic formula for total mortgage.
  var findMortgage = function (pay, monthlyInterest, totalPeriods) {
    var mortgage =
      (pay * ((1 - (Math.pow((1 +
        (monthlyInterest / 100)), -totalPeriods))))) / (monthlyInterest / 100);

    return mortgage;
  };

  var periodsRequested = options.payments || (options.term * 12),
    totalPeriods =
    getMaxTerm(options.age, settings.maxAge, periodsRequested),
    maxMonthlyPayment =
    findMaxPay(options.monthlyIncome, options.monthlyExpenses),
    mortgageTotal =
    findMortgage(maxMonthlyPayment, (options.interest) / 12, totalPeriods),
    totalPriceHouse = mortgageTotal + options.initialDeposit,
    totalInterest = 0;

  if (mortgageTotal !== 0) {
    totalInterest = totalAmortization({
      mortgageTotal: mortgageTotal,
      maxMonthlyPayment: maxMonthlyPayment,
      term: periodsRequested,
      interest: options.interest / 12
    });
  }

  return {
    maxMonthlyPayment: maxMonthlyPayment,
    mortgageTotal: +mortgageTotal.toFixed(7), // toFixed() converts the value to
    totalPriceHouse: +totalPriceHouse.toFixed(7), // string, so we add a +
    totalInterest: +totalInterest.toFixed(7) // that converts it back to number.
  };
}

function getMaxTerm(age, maxAge, periodsRequested) {
  var maxPeriods = ((maxAge - age) * 12);

  if (maxPeriods > periodsRequested) {
    return periodsRequested;
  } else {
    return maxPeriods;
  }
}

function totalAmortization(argument) {
  var amortizationResult = amortization(
    argument.mortgageTotal,
    argument.maxMonthlyPayment, argument.term, argument.interest / 100);

  var totalInterest = 0;

  function getTotalInterest(element) {
    totalInterest += element.amortizationInterest;
  }
  amortizationResult.forEach(getTotalInterest);
  return totalInterest;
}

if (typeof module !== "undefined") {
  module.exports = calculateMortgage;
}
