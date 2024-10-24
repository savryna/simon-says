import { BaseElement } from '../../common/baseElem.js';
import { Hero } from '../hero/hero.js';
import { Slider } from '../slider/slider.js';

export class Main extends BaseElement {
  constructor() {
    super('main', []);

    const hero = new Hero();
    const slider = new Slider();

    this.append(hero, slider);
  }
}
