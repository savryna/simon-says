import { BaseElement } from '../../common/baseElem.js';
import styles from './giftCards.module.scss';
import { Card } from '../card/card.js';
import data from '../../data/gifts.json';

export class GiftCards extends BaseElement {
  tabInner = ['All', 'for work', 'for health', 'for harmony'];
  cardsContent = {
    work: {
      srcImg: './img/gift-for-work.png',
      tag: 'for work',
      innerText: [
        'Console.log Guru',
        'Bug Magnet',
        'Shortcut Cheater',
        'Merge Master',
      ],
      styleTag: 'forWork',
    },
    health: {
      srcImg: './img/gift-for-health.png',
      tag: 'for health',
      innerText: [
        'Step Master',
        'Posture Levitation',
        'Snack Resister',
        'Hydration Bot',
      ],
      styleTag: 'forHealth',
    },

    harmony: {
      srcImg: './img/gift-for-harmony.png',
      tag: 'for harmony',
      innerText: [
        'Bug Acceptance Guru',
        'Error Laugher',
        'Joy Charger',
        'Spontaneous Coding Philosopher',
      ],
      styleTag: 'forHarmony',
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
      'h2',
      [styles.title],
      {},
      'Achieve health, harmony, and inner strength',
    );

    const tabsContainer = new BaseElement('ul', [styles.tabsContainer]);
    const tabsButton = Array.from(
      { length: this.tabInner.length },
      (_, idx) =>
        new BaseElement('button', [styles.tabButton], {}, this.tabInner[idx]),
    );
    const tabItem = Array.from({ length: this.tabInner.length }, (tab, idx) => {
      if (idx === 0) {
        return new BaseElement('li', [styles.tabItem, styles.active], {});
      }
      return new BaseElement('li', [styles.tabItem], {});
    });

    const cardsContainer = new BaseElement('div', [styles.cardsContainer]);

    const giftCardAmound = data.length;
    cardsContainer.append(...this.createArrCard());

    tabItem.forEach((li, idx) => li.append(tabsButton[idx]));
    tabsContainer.append(...tabItem);
    this.append(title, tabsContainer, cardsContainer);
  }

  createArrCard() {
    const arrCard = [];

    const cardAmount = data.length;

    for (let i = 0; i < cardAmount; i++) {
      this.curCard = new Card();
      this.cardJSON = data[i];
      arrCard.push(this.curCard.createCard(this.cardJSON));
    }

    return arrCard;
  }
}
