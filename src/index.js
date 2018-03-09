var emptyFunction = function () {
};

function ferryboat(options) {
  options            = options || {};
  this.max           = isNaN(options.max) ? 1 : options.max;
  this.stopOnFail    = typeof options.stopOnFail === 'boolean' ? options.stopOnFail : true;
  this.taskList      = options.taskList || [];
  this.onSuccess     = options.onSuccess || emptyFunction;
  this.onFail        = options.onFail || emptyFunction;
  this.onComplete    = options.onComplete || emptyFunction;
  this.stopped       = false;
  this.pointer       = 0;
  this.doingCount    = 0;
  this.successCount  = 0;
  this.failCount     = 0;
  this.completeCount = 0;
  this.total         = this.taskList.length;
  this._run();
}

ferryboat.prototype._run = function () {
  for (var i = 0; i < this.max; i++) {
    this._next();
  }
};

ferryboat.prototype._next = function () {
  var that = this;

  function _checkComplete() {
    if (that.completeCount === that.taskList.length) {
      _onComplete();
    } else {
      that._next();
    }
  }

  function _onComplete() {
    that.onComplete({
      successCount: that.successCount,
      failCount: that.failCount,
      total: that.total
    });
  }

  if (this.doingCount >= this.max) return;
  if (this.pointer >= this.taskList.length) return;
  if (this.stopped) return;
  var index = this.pointer++;
  var task  = this.taskList[index];
  this.doingCount++;
  task.fn()
    .then(function (result) {
      this.doingCount--;
      this.successCount++;
      this.completeCount++;
      this.onSuccess({
        result: result,
        current: this.completeCount,
        total: this.total,
        taskIndex: index
      });
      _checkComplete();
    }.bind(this))
    .catch(function (error) {
      this.doingCount--;
      this.failCount++;
      this.completeCount++;
      this.onFail({
        error: error,
        current: this.completeCount,
        total: this.total,
        taskIndex: index
      });
      if (this.stopOnFail) {
        _onComplete();
        this.stopped = true;
        return;
      }
      _checkComplete();
    }.bind(this));
};

ferryboat.prototype.add = function (task) {
  this.total = this.taskList.push(task);
  if (this.stopped) this.stopped = false;
  this._next();
};