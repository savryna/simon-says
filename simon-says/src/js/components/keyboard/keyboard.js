import { BaseElement } from '../../common/baseElement.js';
import styles from './keyboard.module.css';

export class Keyboard extends BaseElement {
  ASCII_EN_SHIFT = 97;
  EN_LENGTH = 26;
  EN_ALPHABET = Array.from({ length: this.EN_LENGTH }, (_, i) =>
    String.fromCharCode(i + this.ASCII_EN_SHIFT),
  );
  QWERTY = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  constructor() {
    super('div', [styles.keyboardWrapper]);

    this.keyButtonsObject = Object.fromEntries(this.createKeyButtons());

    const buttonsLetters = Object.keys(this.keyButtonsObject);
    const buttonsElems = Object.values(this.keyButtonsObject);
    buttonsElems.forEach((button, idx) =>
      button.addEventListener('click', () => console.log(buttonsLetters[idx])),
    );
    document.body.addEventListener('keydown', (event) => this.pushPhysicKeyboard(event));
    this.drawKeyboard();
  }

  createKeyButtons() {
    return Array.from({ length: this.EN_ALPHABET.length }, (_, idx) => {
      return [
        this.EN_ALPHABET[idx],
        new BaseElement('button', [styles.keyButton], {}, this.EN_ALPHABET[idx]),
      ];
    });
  }

  drawKeyboard() {
    for (let rowIdx = 0; rowIdx < this.QWERTY.length; rowIdx++) {
      const rowElem = new BaseElement('div', [styles.rowWrapper]);
      for (let buttonIdx = 0; buttonIdx < this.QWERTY[rowIdx].length; buttonIdx++) {
        rowElem.append(this.keyButtonsObject[this.QWERTY[rowIdx][buttonIdx]]);
      }
      this.append(rowElem);
    }
  }

  pushPhysicKeyboard(event) {
    for (const button in this.keyButtonsObject) {
      if (event.code === `Key${button.toUpperCase()}` || event.key === button) {
        this.keyButtonsObject[button].toggleClass([styles.active], true);
      }
    }
  }
}
