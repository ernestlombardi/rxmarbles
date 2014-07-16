// Generated by CoffeeScript 1.7.1
(function() {
  var Rx, makeScheduler, printStream, s1, s2, vtscheduler;

  Rx = require('rx');

  makeScheduler = function() {
    var scheduler;
    scheduler = new Rx.VirtualTimeScheduler(0, function(x, y) {
      if (x > y) {
        return 1;
      }
      if (x < y) {
        return -1;
      }
      return 0;
    });
    scheduler.add = function(absolute, relative) {
      return absolute + relative;
    };
    scheduler.toDateTimeOffset = function(absolute) {
      return Math.floor(absolute / 1000);
    };
    scheduler.toRelative = function(timeSpan) {
      return timeSpan;
    };
    return scheduler;
  };

  vtscheduler = makeScheduler();

  s1 = Rx.Observable.interval(2000, vtscheduler).map(function() {
    return 2;
  }).scan(function(x, y) {
    return x + y;
  }).take(4);

  s2 = Rx.Observable.interval(5000, vtscheduler).map(function() {
    return 1;
  }).scan(function(x, y) {
    return x + y;
  }).take(2);

  printStream = function(stream, scheduler) {
    var output;
    output = "------------------------------->";
    return stream.observeOn(scheduler).timestamp(scheduler).subscribe(function(x) {
      var i;
      i = x.timestamp;
      output = output.slice(0, i - 1) + String(x.value) + output.slice(i);
      return true;
    }, function() {}, function() {
      var end;
      end = scheduler.now() + 1;
      output = output.slice(0, end - 1) + '|>';
      console.log(output);
      return true;
    });
  };

  printStream(s1, vtscheduler);

  printStream(s2, vtscheduler);

  printStream(Rx.Observable.merge(s1, s2), vtscheduler);

  vtscheduler.start();

}).call(this);
