if (typeof require !== "undefined") {
  var expect = require("chai").expect,
    amortizationFixtures = require("./fixtures/amortization.json"),
    getAmortization = require("../lib/amortization.js");
} else {
  var request = new XMLHttpRequest();
  request.open("GET", "fixtures/amortization.json", false);
  request.send(null);
  var amortizationFixtures = JSON.parse(request.responseText);
}

describe("getAmortization: when using the function, it:", function () {

  it("should expose a function", function () {
    expect(getAmortization).to.be.a("function");
  });

  for (var i = 0; i < amortizationFixtures.length; i += 1) {
    it("should pass test nº " +
      amortizationFixtures[i].explanation,
      checkFixtures(amortizationFixtures[i]));
  }
});

function checkFixtures(fixture) {
  return function () {
    expect(getAmortization.apply(null, fixture.input)).to.eql(fixture.output);
  };
}
