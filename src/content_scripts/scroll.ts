// px/s
let SPEED_SLOW = 200;
let SPEED_NORMAL = 1000;
let SPEED_FAST = 3000;
let SUPER_SPEED_FAST = 20000;
let UP_KEY = "KeyK";
let DOWN_KEY = "KeyJ";
const FAST_KEY = ["ShiftLeft", "ShiftRight"];
const SLOW_KEY = ["AltLeft", "AltRight"];

const $hoverPrevent = document.createElement("div");
const $scrollElement = document.scrollingElement!;
let previousTimeStamp: number | null = null;
let stopped = false;
let frame: number | null = null;
let isFast = false;
let isSlow = false;

function getSpeed() {
  if (isSlow && isFast) {
    return SUPER_SPEED_FAST;
  }

  if (isSlow) {
    return SPEED_SLOW;
  }

  if (isFast) {
    return SPEED_FAST;
  }

  return SPEED_NORMAL;
}

function animateScroll(direction: number) {
  stopped = false;
  previousTimeStamp = null;

  function step(timestamp: number) {
    if (previousTimeStamp === null) {
      previousTimeStamp = timestamp;
    }

    const delta = (timestamp - previousTimeStamp!) / 1000;
    const speed = getSpeed();
    console.log(speed);

    $scrollElement.scrollBy({
      top: direction * speed * delta,
      behavior: "auto",
    });

    previousTimeStamp = timestamp;

    if (!stopped) {
      frame = window.requestAnimationFrame(step);
    }
  }

  frame = window.requestAnimationFrame(step);
}

function stopScroll() {
  if (stopped === true) {
    return;
  }

  if (frame !== null) {
    window.cancelAnimationFrame(frame);
  }

  stopped = true;
}

function getPressedKeys(e: KeyboardEvent) {
  const up = e.code === UP_KEY;
  const down = e.code === DOWN_KEY;
  const fast = FAST_KEY.includes(e.code);
  const slow = SLOW_KEY.includes(e.code);

  const speedModifierKey = fast || slow;
  const directionKey = up || down;
  const any = speedModifierKey || directionKey;

  return {
    up,
    down,
    fast,
    slow,
    speedModifierKey,
    directionKey,
    any,
  };
}

function handleKeyDownDirectionKey(e: KeyboardEvent) {
  const pressedKeys = getPressedKeys(e);
  const isElementFocused = document.querySelector(":focus") !== null;

  if (isElementFocused) {
    return;
  }

  animateScroll(pressedKeys.down ? 1 : -1);
  $hoverPrevent.classList.add("scroll-hover-prevent");
}

function handleKeyUpDirectionKey() {
  stopScroll();
  $hoverPrevent.classList.remove("scroll-hover-prevent");
}

function handleKeyDownModifierKey(e: KeyboardEvent) {
  const pressedKeys = getPressedKeys(e);

  if (pressedKeys.fast) {
    isFast = true;
  }

  if (pressedKeys.slow) {
    isSlow = true;
  }
}

function handleKeyUpModifierKey(e: KeyboardEvent) {
  const pressedKeys = getPressedKeys(e);

  if (pressedKeys.fast) {
    isFast = false;
  }

  if (pressedKeys.slow) {
    isSlow = false;
  }
}

function setupListeners() {
  document.addEventListener("keydown", (e) => {
    const pressedKeys = getPressedKeys(e);
    const isRepeatedClick = e.repeat;

    if (isRepeatedClick || !pressedKeys.any) {
      return;
    }

    if (pressedKeys.directionKey) {
      handleKeyDownDirectionKey(e);
    }

    if (pressedKeys.speedModifierKey) {
      handleKeyDownModifierKey(e);
    }
  });

  document.addEventListener("keyup", (e) => {
    const pressedKeys = getPressedKeys(e);

    if (!pressedKeys.any) {
      return;
    }

    if (pressedKeys.directionKey) {
      handleKeyUpDirectionKey();
    }

    if (pressedKeys.speedModifierKey) {
      handleKeyUpModifierKey(e);
    }
  });

  document.addEventListener("webkitvisibilitychange", (e) => {
    if (!(document as any).webkitHidden) {
      stopScroll();
      isFast = false;
      isSlow = false;
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    $hoverPrevent.id = "scroll-hover-prevent";
    document.body.appendChild($hoverPrevent);
  });
}

const defaultValues = {
  SPEED_SLOW: 200,
  SPEED_NORMAL: 1000,
  SPEED_FAST: 3000,
  SUPER_SPEED_FAST: 20000,
  UP_KEY: "KeyK",
  DOWN_KEY: "KeyJ",
};
// TODO: Check get values
type DefaultValues = typeof defaultValues;
chrome.storage.sync.get(
  {
    SPEED_SLOW: 200,
    SPEED_NORMAL: 1000,
    SPEED_FAST: 3000,
    SUPER_SPEED_FAST: 20000,
    UP_KEY: "KeyK",
    DOWN_KEY: "KeyJ",
  },
  (_restored) => {
    const restored = _restored as DefaultValues;

    SPEED_SLOW = restored.SPEED_SLOW;
    SPEED_NORMAL = restored.SPEED_NORMAL;
    SPEED_FAST = restored.SPEED_FAST;
    SUPER_SPEED_FAST = restored.SUPER_SPEED_FAST;
    UP_KEY = restored.UP_KEY;
    DOWN_KEY = restored.DOWN_KEY;

    setupListeners();
  }
);
