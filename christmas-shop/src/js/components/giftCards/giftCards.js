import { BaseElement } from '../../common/baseElem.js';
import styles from './giftCards.module.scss';

export class GiftCards extends BaseElement {
  tabInner = ['All', 'for work', 'for health', 'for harmony'];
  cardsContent = {
    work: {
      srcImg: '/img/gift-for-work.png',
      tag: 'for work',
      innerText: [
        'Console.log Guru',
        'Bug Magnet',
        'Shortcut Cheater',
        'Merge Master',
      ],
    },
    health: {
      srcImg: '/img/g/gift-for-health.png',
      tag: 'for health',
      innerText: [
        'Step Master',
        'Posture Levitation',
        'Snack Resister',
        'Hydration Bot',
      ],
    },

    harmony: {
      srcImg: '/img/g/gift-for-harmony.png',
      tag: 'for harmony',
      innerText: [
        'Bug Acceptance Guru',
        'Error Laugher',
        'Joy Charger',
        'Spontaneous Coding Philosopher',
      ],
    },
  };

  layoutCardQueue = [
    this.cardsContent.work,
    this.cardsContent.health,
    this.cardsContent.work,
    this.cardsContent.work,
    this.cardsContent.health,
    this.cardsContent.harmony,
    this.cardsContent.health,
    this.cardsContent.harmony,
    this.cardsContent.health,
    this.cardsContent.work,
    this.cardsContent.harmony,
    this.cardsContent.harmony,
  ];

  constructor() {
    super('section', [styles.giftCardsSection]);

    const title = new BaseElement(
      'h1',
      [styles.title],
      {},
      'Achieve health,<br> harmony, and<br> inner strength',
    );

    const tabsContainer = new BaseElement('ul', [styles.tabsContainer]);
    const tabsButton = Array.from(
      { length: this.tabInner.length },
      (_, idx) =>
        new BaseElement('button', [styles.tabButton], {}, this.tabInner[idx]),
    );
    const tabItem = Array.from(
      { length: this.tabInner.length },
      (_, idx) => new BaseElement('li', [styles.tabItem], {}),
    );
    tabItem[0].addClasses([styles.active]);

    tabItem.forEach((li, idx) => li.append(tabsButton[idx]));
    tabsContainer.append(...tabItem);
    this.append(title, tabsContainer);

    console.log(this.cardsContent.work);
  }
}
