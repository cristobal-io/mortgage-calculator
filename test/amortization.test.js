if (typeof require !== "undefined") {
  var expect = require("expect.js"),
    fixtures = require("./fixtures/amortization.json"),
    getAmortization = require("../lib/amortization.js");
}


describe("when using the getAmortization function, it:", function () {

  it("should expose a function", function () {
    expect(getAmortization).to.be.a("function");
  });

  for (var i = 0; i < fixtures.length; i += 1) {
    it("should pass test nº " +
      fixtures[i].explanation, checkFixtures(fixtures[i]));
  }
});

function checkFixtures(fixture) {
  return function () {
    expect(getAmortization.apply(null, fixture.input)).to.eql(fixture.output);
  };
}
