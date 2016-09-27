# gulp-total-task-time

This plugin will add a Total time at the end of any task/tasks in a grunt like fashion.

Put then following code in the top of your gulpfile (before any tasks are defined).

```javascript
var taskTime = require('gulp-total-task-time');

taskTime.init();
```

Running tasks will then look something like this:
```bash
[11:02:41] Using gulpfile C:\path\to\gulpfile.js
[11:02:41] Starting 'task1'...
[11:02:43] Finished 'task1' after 2.51 s
[11:02:43] Starting 'task2'...
[11:02:46] Finished 'task2' after 3.32 s
Total 5.8s
```
