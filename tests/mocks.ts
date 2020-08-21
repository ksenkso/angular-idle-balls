export const mockLocalStorage = () => {
  let storage = {};
  spyOn(localStorage, 'getItem').and.callFake((key: string) => {
    return storage[key];
  });
  spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
    storage[key] = value;
  });
  spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
    delete storage[key];
  });
  spyOn(localStorage, 'clear').and.callFake(() => {
    storage = {};
  });
  return storage;
};

export const mockAddEventListener = () => {
  const events = {};
  // @ts-ignore
  spyOn(window, 'addEventListener').and.callFake((event: string, fn: () => any) => {
    events[event] = events[event] ? events[event].concat(fn) : [fn];
  });
  // @ts-ignore
  spyOn(window, 'dispatchEvent').and.callFake((event: Event) => {
    if (events[event.type]) {
      events[event.type].forEach(fn => fn());
    }
  });
  return events;
};
