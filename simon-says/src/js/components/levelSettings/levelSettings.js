export const LEVELS = ['easy', 'middle', 'hard'];

const NUMBER_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const QWERTY = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];
export const EASY_KEYBOARD = [NUMBER_ROW];
export const MIDDLE_KEYBOARD = [...QWERTY];
export const HARD_KEYBOARD = [NUMBER_ROW, ...QWERTY];
