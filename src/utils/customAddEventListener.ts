// 自定义 addEventListener

class CreateEvent {
  eventQueue!: Map<string, Event>;
  static instance: CreateEvent;
  constructor() {
    if (CreateEvent.instance) {
      return CreateEvent.instance;
    }
    this.eventQueue = new Map();
    CreateEvent.instance = this;
    return this;
  }

  addEventListener(
    key: string,
    cb: (...arg: unknown[]) => unknown,
    obj = window
  ) {
    obj.addEventListener(key as string, cb);
  }
  // 新增并触发事件
  dispatchEvent(key: string, payload = {}, obj = window) {
    if (!this.eventQueue.has(key)) {
      this.eventQueue.set(key, new CustomEvent(key, payload));
    }
    const customEvent = this.eventQueue.get(key);
    customEvent && obj.dispatchEvent(customEvent);
  }
}

export default new CreateEvent();
