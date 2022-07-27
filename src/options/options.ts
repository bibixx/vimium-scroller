async function saveOptions() {
  const SPEED_SLOW =
    document.querySelector<HTMLInputElement>("#SPEED_SLOW")!.valueAsNumber;
  const SPEED_NORMAL =
    document.querySelector<HTMLInputElement>("#SPEED_NORMAL")!.valueAsNumber;
  const SPEED_FAST =
    document.querySelector<HTMLInputElement>("#SPEED_FAST")!.valueAsNumber;
  const SUPER_SPEED_FAST =
    document.querySelector<HTMLInputElement>(
      "#SUPER_SPEED_FAST"
    )!.valueAsNumber;
  const UP_KEY = document.querySelector<HTMLInputElement>("#UP_KEY")!.value;
  const DOWN_KEY = document.querySelector<HTMLInputElement>("#DOWN_KEY")!.value;

  await new Promise<void>((resolve) =>
    chrome.storage.sync.set(
      {
        SPEED_SLOW,
        SPEED_NORMAL,
        SPEED_FAST,
        SUPER_SPEED_FAST,
        UP_KEY,
        DOWN_KEY,
      },
      () => resolve()
    )
  );

  alert("Saved!");
}

async function restoreOptions() {
  const defaultValues = {
    SPEED_SLOW: 200,
    SPEED_NORMAL: 1000,
    SPEED_FAST: 3000,
    SUPER_SPEED_FAST: 20000,
    UP_KEY: "KeyK",
    DOWN_KEY: "KeyJ",
  };
  type DefaultValues = typeof defaultValues;

  const restored = await new Promise<DefaultValues>((resolve) => {
    chrome.storage.sync.get(defaultValues, (values) =>
      resolve(values as DefaultValues)
    );
  });

  document.querySelector<HTMLInputElement>("#SPEED_SLOW")!.valueAsNumber =
    restored.SPEED_SLOW;
  document.querySelector<HTMLInputElement>("#SPEED_NORMAL")!.valueAsNumber =
    restored.SPEED_NORMAL;
  document.querySelector<HTMLInputElement>("#SPEED_FAST")!.valueAsNumber =
    restored.SPEED_FAST;
  document.querySelector<HTMLInputElement>("#SUPER_SPEED_FAST")!.valueAsNumber =
    restored.SUPER_SPEED_FAST;
  document.querySelector<HTMLInputElement>("#UP_KEY")!.value = restored.UP_KEY;
  document.querySelector<HTMLInputElement>("#DOWN_KEY")!.value =
    restored.DOWN_KEY;
}

restoreOptions();
document
  .querySelector<HTMLInputElement>("#form")!
  .addEventListener("submit", (e) => {
    e.preventDefault();
    saveOptions();
  });
