if (typeof require !== "undefined") {
  var _ = require("lodash"),
    Decimal = require("decimal.js");
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
  clone = _.compose(JSON.parse, JSON.stringify);

function calculateMortgage(options) {

  // add missing parameters.
  options = _.defaults(clone(options || {}), defaultMortgageOptions);
  var settings =
    _.defaults(clone(options.settings || {}), defaultMortgageOptions.settings);

  // prevent non desired values
  _.forEach(options, function (n, key) {
    if (n < defaultMortgageOptions[key] || isNaN(n)) {
      n = defaultMortgageOptions[key];
      options[key] = defaultMortgageOptions[key];
    }
  });

  if (+options.monthlyExpenses > +options.monthlyIncome) {
    options.monthlyExpenses = options.monthlyIncome;
  }

  // start with the decimal.js
  var initialDeposit = new Decimal(options.initialDeposit),
    age = new Decimal(options.age),
    monthlyIncome = new Decimal(options.monthlyIncome),
    interest = new Decimal(options.interest),
    term = new Decimal(options.term),
    monthlyExpenses = new Decimal(options.monthlyExpenses),
    maxAge = new Decimal(settings.maxAge),
    riskRate = new Decimal(settings.riskRate);

  var periodsRequested = options.payments || (term.times(12)),

    totalPeriods =
    getMaxTerm(age, maxAge, periodsRequested),
    maxMonthlyPayment =
    findMaxPay(monthlyIncome, monthlyExpenses),
    mortgageTotal =
    findMortgage(maxMonthlyPayment, interest.div(12), totalPeriods),
    // decMortgageTotal = new Decimal(mortgageTotal),
    totalPriceHouse = mortgageTotal + options.initialDeposit;

  // economic formula for maximum pay.
  function findMaxPay(monthlyIncome, monthlyExpenses) {
    // console.log(JSON.stringify(riskRate));

    var maxPay = (monthlyIncome.minus(monthlyExpenses)); // * riskRate;
    return maxPay * riskRate;
  }

  // economic formula for total mortgage.
  function findMortgage(pay, monthlyInterest, totalPeriods) {
    var mortgage =
      (pay * ((1 - (Math.pow((1 +
        (monthlyInterest / 100)), -totalPeriods))))) / (monthlyInterest / 100);
    console.log(JSON.stringify(mortgage));
    return mortgage;
  }

  return {
    maxMonthlyPayment: maxMonthlyPayment,
    monthlyIncome: options.monthlyIncome,
    totalPriceHouse: totalPriceHouse.toFixed(7),
    mortgageTotal: mortgageTotal.toFixed(7),
  };
}

function getMaxTerm(age, maxAge, periodsRequested) {
  var maxPeriods = (maxAge.minus(age).times(12));
  if (maxPeriods.greaterThan(periodsRequested)) {
    return periodsRequested;
  } else {
    return maxPeriods;
  }
}

if (typeof module !== "undefined") {
  module.exports = calculateMortgage;
}
