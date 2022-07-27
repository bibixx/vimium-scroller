declare var chrome: {
  storage: {
    sync: {
      get: <T>(def: T, cb: (restored: T) => void) => void;
      set: <T>(def: T, cb: () => void) => void;
    };
  };
};
