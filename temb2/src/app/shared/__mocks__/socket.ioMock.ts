class Io {
  events: any;

  emit(event: string, ...args: any) {
    this.events[event].foreach((func: Function) => func(...args));
  }

  connect() {
    return {
      on: (event: string, func: Function) => {
        if (this.events[event]) {
          return this.events[event].push(func);
        }
        this.events[event] = [func];
      },
      emit: this.emit,
    };
  }
}

export default new Io();
