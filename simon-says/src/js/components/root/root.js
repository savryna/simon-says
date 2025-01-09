import { BaseElement } from '../../common/baseElement.js';
import { Keyboard } from '../keyboard/keyboard.js';
import { SelectLevel } from '../selectLevel/selectLevel.js';
import { PlayWindow } from '../playWindow/playWindow.js';
import styles from './root.module.css';

export class Root extends BaseElement {
  constructor() {
    super('div', [styles.root]);

    const keyboard = new Keyboard();
    const playWindow = new PlayWindow(keyboard);

    this.append(playWindow, keyboard);
  }

  init() {
    this.appendTo(document.body);
  }
}
