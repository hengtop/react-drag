export const events = {
  /*
         保存事件的一个对象，基本结构为{key1:fn[],key2:fn[],...}
         你也可以使用map代替普通的对象
      */
  eventList: {},
  $on(key, fn) {
    if (!this.eventList[key]) {
      this.eventList[key] = [];
    }
    this.eventList[key].push(fn);
  },
  $emit(key, ...args) {
    const fns = this.eventList[key];
    if (!fns || fns.length === 0) {
      return false;
    }
    for (let i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, args);
    }
  },
  $remove(key, fn) {
    const fns = this.eventList[key];
    // 如果用户没有传一个指定函数就删除该类型下的所有函数
    if (!fns) {
      return false;
    }
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (let l = fns.length - 1; l >= 0; l--) {
        const _fn = fns[l];
        if (_fn === fn) {
          fns.splice(l, 1);
        }
      }
    }
  },
};
