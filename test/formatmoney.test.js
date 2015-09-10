/*exported _, defaultOptions*/

if (typeof require !== "undefined") {
  var expect = require("expect.js"),
    formatFixtures = require("./fixtures/format_money.json"),
    _ = require("lodash"),
    formatMoney = require("../lib/format_money.js");
} else {
  var request = new XMLHttpRequest();
  request.open("GET", "fixtures/format_money.json", false);
  request.send(null);
  var formatFixtures = JSON.parse(request.responseText);
}

describe("When passing different values than defaults it:", function () {

  it("should return defaults :$0.90", function () {
    expect(formatMoney.apply(null, [0.90123])).to.be("$0.90");
  });

  it("should return different from defaults :$0,901", function () {
    expect(formatMoney.apply(null, [0.90123, {
      "places": 3,
      "symbol": "$",
      "thousand": ".",
      "decimal": ","
    }])).to.be("$0,901");
  });

  it("should return different from defaults :¶0,9012", function () {
    expect(formatMoney.apply(null, [0.90123, {
      "places": 4,
      "symbol": "¶",
      "thousand": ".",
      "decimal": ","
    }])).to.be("¶0,9012");
  });

  it("should return defaults :$0,90", function () {
    expect(formatMoney.apply(null, [0.90123])).to.be("$0.90");
  });

  it("should return different from defaults :¶0,90123", function () {
    expect(formatMoney.apply(null, [0.90123, {
      "places": 5,
      "symbol": "¶"
    }])).to.be("¶0.90123");
  });

});

describe("when using the formatMoney function, it:", function () {

  it("should expose a function", function () {
    expect(formatMoney).to.be.a("function");
  });

  it("should give the result $2,000.00", function () {
    expect(formatMoney(2000)).to.eql("$2,000.00");
  });

  it("should not modify original options", function () {
    var options = {
      "places": 4
    };
    formatMoney(2000, options);
    expect(options).to.eql({
      "places": 4
    });
  });
});

describe("When using the fixtures it:", function () {

  for (var i = 0; i < formatFixtures.length; i += 1) {
    it("should test " + formatFixtures[i].explanation +
      formatFixtures[i].output, checkFixtures(formatFixtures[i]));
  }
});

function checkFixtures(fixture) {
  return function () {
    expect(formatMoney.apply(null, fixture.input)).to.be(fixture.output);
  };
}
