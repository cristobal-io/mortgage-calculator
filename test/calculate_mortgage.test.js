if (typeof require !== "undefined") {
  var expect = require("chai").expect,
    mortgageFixtures = require("./fixtures/calculate_morgage.json"),
    calculateMortgage = require("../lib/calculate_mortgage.js");
} else {
  var request = new XMLHttpRequest();
  request.open("GET", "fixtures/calculate_morgage.json", false);
  request.send(null);
  var mortgageFixtures = JSON.parse(request.responseText);
}

describe("calculateMortgage: when using the function, it:", function () {

  it("should expose a function", function () {
    expect(calculateMortgage).to.be.a("function");
  });

  it("should do math", function () {
    expect(calculateMortgage({
      "initialDeposit": 20000,
      "monthlyIncome": 2000,
      "interest": 3,
      "term": 20,
      "monthlyExpenses": 800
    })).to.eql({
      maxMonthlyPayment: 432,
      mortgageTotal: 77894.3150262,
      totalPriceHouse: 97894.3150262,
      totalInterest: 1509.0217746
    });
  });

  it("should use defaults for term", function () {
    expect(calculateMortgage({
      "initialDeposit": 20000,
      "monthlyIncome": 2000,
      "interest": 0,
      "term": 1,
      "monthlyExpenses": 800
    })).to.deep.equal({
      maxMonthlyPayment: 432,
      mortgageTotal: 51579.5234551,
      totalPriceHouse: 71579.5234551,
      totalInterest: 21.5748494
    });
  });

  it("should not give an error when passing wrong arguments", function () {
    expect(calculateMortgage({
      "initialDeposit": -1,
      "monthlyIncome": "hi",
      "interest": 0,
      "term": -1,
      "monthlyExpenses": -1
    })).to.eql({
      maxMonthlyPayment: 0.36,
      mortgageTotal: 42.9829362,
      totalPriceHouse: 42.9829362,
      totalInterest: 0.0179790
    });
  });

  for (var i = 0; i < mortgageFixtures.length; i += 1) {
    it("should pass test nº " +
      mortgageFixtures[i].explanation, checkFixtures(mortgageFixtures[i]));
  }

});

describe("calculateMortgage: When using function with different values than" +
  " defaults it",
  function () {

    it("should change risk rate to 45%", function () {
      var options = {
        "initialDeposit": 20,
        "monthlyIncome": 2000,
        "interest": 3,
        "term": 20,
        "monthlyExpenses": 800,
        "settings": {
          "riskRate": 0.45
        }
      };
      calculateMortgage(options);
      expect(options.settings).to.eql({
        "riskRate": 0.45
      });
    });

  });

function checkFixtures(fixture) {
  return function () {
    expect(calculateMortgage.apply(null, fixture.input)).to.eql(fixture.output);
  };
}
