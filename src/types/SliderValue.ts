export type SliderValue = [number, number];

export const isSliderValue = (value: unknown): value is SliderValue => {
  if (!Array.isArray(value) || value.length !== 2 ||
    !value.every((v) => typeof v === 'number' && !Number.isNaN(v)) || value[0] > value[1]) {
    return false;
  }

  return true;
}
