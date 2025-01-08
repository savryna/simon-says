import { BaseElement } from '../../common/baseElement.js';
import { Keyboard } from '../keyboard/keyboard.js';
import styles from './root.module.css';

export class Root extends BaseElement {
  constructor() {
    super('div', [styles.root]);

    const keyboard = new Keyboard();

    this.append(keyboard);
  }

  init() {
    this.appendTo(document.body);
  }
}
