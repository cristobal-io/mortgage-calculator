var expect = require("expect.js"),
  fixtures = require("./fixtures/calculate_morgage.json"),
  calculateMortgage = require("../lib/calculate_mortgage.js");

describe("when using the calculateMortgage function, it:", function () {

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
      monthlyIncome: 2000,
      mortgageTotal: 77894.31502618745,
      totalPriceHouse: 97894.31502618745
    });
  });

  it("should use defaults for term", function () {
    expect(calculateMortgage({
      "initialDeposit": 20000,
      "monthlyIncome": 2000,
      "interest": 0,
      "term": 1,
      "monthlyExpenses": 800
    })).to.eql({
      maxMonthlyPayment: 432,
      monthlyIncome: 2000,
      mortgageTotal: 51579.523455058195,
      totalPriceHouse: 71579.523455058195
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
      monthlyIncome: 1,
      mortgageTotal: 42.982936212548495,
      totalPriceHouse: 42.982936212548495
    });
  });

  for (var i = 0; i < fixtures.length; i += 1) {
    it("should pass test nº " +
      fixtures[i].explanation, checkFixtures(fixtures[i]));
  }

});

describe("When using calculateMortgage function with different values than" +
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
