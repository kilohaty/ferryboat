# ferryboat
> An async control-flow library

# Browser
 ```html
 <script src="yourStaticPath/ferryboat.js"></script>
```

# Default import
```
npm install ferryboat
```

```js
import ferryboat from 'ferryboat';
```

# Usage
```js
  function test(value) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(value || 'ferryboat' + Math.random());
      }, 1000);
    });
  }

  new ferryboat({
    max: 2,
    stopOnFail: false,
    taskList: [
      {
        fn: test
      },
      {
        fn: test
      },
      {
        fn: test
      },
      {
        fn: test
      },
      {
        fn: test.bind(null, 'FERRYBOAT')
      }
    ],
    onSuccess: function (res) {
      console.log(res.result);
      console.log(res.current);
      console.log(res.total);
      console.log(res.taskIndex);
    },
    onFail: function (res) {
      console.log(res.error);
      console.log(res.current);
      console.log(res.total);
      console.log(res.taskIndex);
    },
    onComplete: function (res) {
      console.log(res.successCount);
      console.log(res.failCount);
      console.log(res.total);
    }
  });
```

# API
## Constructor
new ferryboat(options);

| Names | Required | Type | Description
| --- | --- | --- | ---
| options | `true` | `Object` | initial options

## Options
| Names | Defaults | Description
| --- | --- | ---
| max | `1` | maximum number of processes
| stopOnFail | `true` | stop execute when a task fails
| taskList | `[]` | task list (the function should returns promise)
| onSuccess | `20` | success callback function
| onFail | `true` | fail callback function
| onComplete | `false` | complete callback function
