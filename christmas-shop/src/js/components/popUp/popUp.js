import { BaseElement } from '../../common/baseElem';
import styles from './popUp.module.scss';
// import { Main2Page } from '../main2Page/main';
// import { Card } from '../card/card';
import dataJSON from '../../data/gifts.json';
// import GiftCards from '../../components/giftCards/giftCards.js';

export class PopUp extends BaseElement {
  imgExtension = ['avif', 'webp', 'png'];
  modalsContent = [
    {
      src: './img/gift-for-work',
      category: 'For Work',
      cssStyle: 'forWork',
    },
    {
      src: './img/gift-for-health',
      category: 'For Health',
      cssStyle: 'forHealth',
    },
    {
      src: './img/gift-for-harmony',
      category: 'For Harmony',
      cssStyle: 'forHarmony',
    },
  ];

  snowflakePoint = {
    active: './img/svg/snowflake-active.svg',
    notActive: './img/svg/snowflake.svg',
  };

  maxPoint = 5;

  constructor() {
    super('dialog', [styles.popUp]);

    // const dataCard = new GiftCards().dataCard;
    // console.log(dataCard);
    // const cardArr = new GiftCards().cardArr;

    // window.addEventListener('click', () => console.log(typeof cardArr));
    this.addEventListener('click', (event) => this.closeClickBack(event));
    this.addEventListener('keydown', (event) => this.closeKey(event));
  }

  // getDataFromCard(data) {
  //   console.log(data);
  // }

  showDialog() {
    this.appendTo(document.body);
    document.body.classList.add(styles.noScroll);
    this._elem.showModal();
  }

  closeDialog() {
    this._elem.close();
    this.setInnerHTML('');
    document.body.classList.remove(styles.noScroll);
  }

  closeKey(event) {
    if (event.key === 'Escape') {
      this.closeDialog();
    }
  }

  closeClickBack(event) {
    const modalRect = this._elem.getBoundingClientRect();

    if (
      event.clientX < modalRect.left ||
      event.clientX > modalRect.right ||
      event.clientY < modalRect.top ||
      event.clientY > modalRect.bottom
    ) {
      this.closeDialog();
      this.setInnerHTML('');
    }
  }

  findSrcToModal(data) {
    return this.modalsContent.find(
      (content) => content.category === data.category,
    );
    // console.log(a);
    // return a;
  }

  findInJSON(card) {
    return dataJSON.find(
      (cardJSON) => cardJSON.description === card.cardDescription,
    );
  }

  createPopUp(data) {
    const currentJSONCard = this.findInJSON(data);
    this.showDialog();
    // console.log(data);
    console.log(currentJSONCard);
    // console.log(this.findSrcToModal(data).cssStyle);
    // console.log(data.cardImg.getAttribute('src'));
    this.modalPicture = new BaseElement('picture', [styles.modalPicture]);
    this.modalImg = new BaseElement('img', [styles.modalImg], {
      src: `${this.findSrcToModal(data).src}.png`,
      alt: `${data.cardImg.getAttribute('alt')}`,
    });
    this.modalSources = Array.from(
      { length: this.imgExtension.length },
      (_, idxSource) =>
        new BaseElement('source', [], {
          type: `image/${this.imgExtension[idxSource]}`,
          srcset: `${this.findSrcToModal(data).src}.${this.imgExtension[idxSource]}`,
        }),
    );
    this.giftDescription = new BaseElement('div', [styles.giftDescription]);
    this.descriptionText = new BaseElement('div', [styles.descriptionText]);
    this.tag = new BaseElement(
      'p',
      [styles.tag, styles[this.findSrcToModal(data).cssStyle]],
      {},
      currentJSONCard.category,
    );
    this.name = new BaseElement('h3', [styles.name], {}, currentJSONCard.name);
    this.description = new BaseElement(
      'p',
      [styles.description],
      {},
      currentJSONCard.description,
    );

    this.superpowers = new BaseElement('div', [styles.superpowers]);
    this.superpowersHeader = new BaseElement(
      'h4',
      [styles.superpowersHeader],
      {},
      'Adds superpowers to:',
    );
    this.superpowersBottom = new BaseElement('ul', [styles.superpowersBottom]);
    this.superpowersItem = Array.from(
      {
        length: Object.keys(currentJSONCard.superpowers).length,
      },
      (_, idxItems) => new BaseElement('li', [styles.superpowersItem]),
    );
    this.superpowersItemName = Array.from(
      {
        length: Object.keys(currentJSONCard.superpowers).length,
      },
      (_, idxItemName) =>
        new BaseElement(
          'span',
          [styles.superpowersItemName],
          {},
          Object.keys(currentJSONCard.superpowers)[idxItemName],
        ),
    );

    this.superpowersPoint = Array.from(
      {
        length: Object.keys(currentJSONCard.superpowers).length,
      },
      (_, idxPoint) =>
        new BaseElement(
          'div',
          [styles.superpowersPoint],
          {},
          Object.values(currentJSONCard.superpowers)[idxPoint],
        ),
    );
    // this.superpowersLeft = new BaseElement('ul', [styles.superpowersList]);
    // this.superpowersLeftItem = Array.from(
    //   {
    //     length: Object.keys(currentJSONCard.superpowers).length,
    //   },
    //   (_, idxSuperpowers) =>
    //     new BaseElement(
    //       'li',
    //       [styles.superpowersItem],
    //       {},
    //       Object.keys(currentJSONCard.superpowers)[idxSuperpowers],
    //     ),
    // );
    // this.superpowersRight = new BaseElement('ul', [styles.superpowersRight]);
    // this.superpowersRightItem = Array.from(
    //   {
    //     length: Object.keys(currentJSONCard.superpowers).length,
    //   },
    //   () => new BaseElement('li', [styles.superpowersRightItem]),
    // );

    // this.superpowersPoint = Array.from(
    //   {
    //     length: Object.keys(currentJSONCard.superpowers).length,
    //   },
    //   (_, idxPoints) =>
    //     new BaseElement(
    //       'span',
    //       [styles.superpowersPoint],
    //       {},
    //       Object.values(currentJSONCard.superpowers)[idxPoints],
    //     ),
    // );

    // this.superpowersLeft.append(...this.superpowersLeftItem);
    // this.superpowersRightItem.forEach((li) =>
    //   li.append(...this.superpowersPoint),
    // );
    // this.superpowersRight.append(...this.superpowersRightItem);
    // this.superpowersBottom.append(this.superpowersLeft, this.superpowersRight);

    // this.innerSnowflake(data);
    const snowflakePoints = Array.from(
      {
        length: Object.keys(currentJSONCard.superpowers).length,
      },
      () =>
        Array.from({ length: this.maxPoint }, () => {
          new BaseElement('img', [styles.snowflakeImg], {
            src: this.snowflakePoint.active,
          });
        }),
    );
    console.log(snowflakePoints);
    // this.superpowersPoint.forEach((div, idx) =>
    //   div.append(this.innerSnowflake(data)[idx]),
    // );
    this.superpowersItem.forEach((item, idx) =>
      item.append(
        this.superpowersItemName[idx],
        this.superpowersPoint[idx],
        snowflakePoints[idx],
      ),
    );
    this.superpowersBottom.append(...this.superpowersItem);
    this.superpowers.append(this.superpowersHeader, this.superpowersBottom);

    this.giftDescription.append(this.descriptionText, this.superpowers);
    this.descriptionText.append(this.tag, this.name, this.description);
    this.modalPicture.append(...this.modalSources, this.modalImg);
    this.append(this.modalPicture, this.giftDescription);
  }

  innerSnowflake(data) {
    const currentJSONCard = this.findInJSON(data);
    const pointArray = Object.values(currentJSONCard.superpowers).map(
      (points) => +points[1],
    );
    const snowflakePoints = Array.from(
      {
        length: Object.keys(currentJSONCard.superpowers).length,
      },
      () =>
        Array.from({ length: this.maxPoint }, () => {
          new BaseElement('img', [styles.snowflakeImg], {
            src: this.snowflakePoint.active,
          });
        }),
    );
    console.log(snowflakePoints);
    return snowflakePoints;
    // console.log(pointArray);
  }
}
