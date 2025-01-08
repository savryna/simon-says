import { BaseElement } from '../../common/baseElement.js';
import { Keyboard } from '../keyboard/keyboard.js';
import { PlayWindow } from '../playWindow/playWindow.js';
import styles from './root.module.css';

export class Root extends BaseElement {
  constructor() {
    super('div', [styles.root]);

    const playWindow = new PlayWindow();
    const keyboard = new Keyboard();

    this.append(playWindow, keyboard);
  }

  init() {
    this.appendTo(document.body);
  }
}
