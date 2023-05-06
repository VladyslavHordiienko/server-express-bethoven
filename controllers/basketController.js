const nodemailer = require('nodemailer');

class basketController {
  async create(req, res) {
    const { products_list, contact_info, delivery_info, payment_info, totalPrice } = req.body;

    try {
      let productListHtml = '';

      for (let el of products_list) {
        let imgUrl = 'http://localhost:4000/static/' + el.info.img;
        productListHtml += `
        <div class="order__row">
          <div class="order__right">
          <div class="order__flex">
              <img src=${imgUrl} alt=""/>
              <div>
                <div class="order__title-inner">${el.info.product_name_ua} (${el.info.product_weight} кг.)</div>
                <div class="order__code">Код товару: ${el.info.factory_articul}</div>
              </div>
          </div>

          </div>
          <div class="order__left">
            <div class="order__price">${el.innerTotal} грн.</div>
            <div class="order__count">${el.count} x ${el.info.product_price} грн.</div>
          </div>
        </div>
        `;
      }

      const html = `
      <style>
      &{
        color: #fff;
      }
        .order__logo{
          width:100%;
          max-width:331px;
          height:auto;
          display:block;
          margin-bottom:40px;
        }
        .order__title{
          font-weight: 700;
          font-size: 28px;
          line-height: 34px;
          margin-bottom:20px;
          color: #222;
        }
        .order__subtitle{
          font-size: 16px;
          line-height: 19px;
          margin-bottom:30px;
          color: #222;
        }
        .order__row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding: 25px 120px;
          border-bottom:1px solid #E3E3E3;
          color: #222;
        }
        .order__wrap{
          border: 1px solid #E3E3E3;
          border-bottom: none;
        }
        .order__flex{
          display:flex;
          align-items:center;
        }
        .order__flex>img{
          width:100%;
          max-width:63px;
          height:auto;
          display:inline-block;
          margin-right:20px;
        }
        .order__title-inner{
          font-size: 15px;
          line-height: 19px;
          font-weight: 700;
          margin-bottom:15px;
        }
        .order__code{
          font-size: 14px;
          line-height: 18px;
          color: #B9B9B9;
        }
        .order__price{
          font-size: 14px;
          line-height: 18px;
          font-weight: 700;
          margin-bottom:5px;
        }
        .order__count{
          font-size: 14px;
          line-height: 18px;
          color: #B9B9B9;
        }
        .order__info-title{
          font-size: 14px;
          line-height: 19px;
          font-weight: 700;
        }
        .order__value{
          font-size: 14px;
          line-height: 18px;
          text-align: right;
        }
        .order__value.--total{
          font-weight: 700;
          font-size: 24px;
          line-height: 18px;
        }
        @media(max-width:768px){
          .order__row {
            padding:20px;
          }
        }
      </style>
       <img src="http://localhost:3000/logo.svg" alt="" class="order__logo"/>
        <div class="order__title">Нове замовлення від ${contact_info.fullName}!</div>
        <div class="order__wrap">
          ${productListHtml}
          <div class="order__row">
          <div class="order__info-title">Ім'я клієнта</div>
          <div class="order__value">${contact_info.fullName}</div>
          </div>
          <div class="order__row">
          <div class="order__info-title">Контакти клієнта</div>
          <div class="order__value">${contact_info.phoneNumber}, ${contact_info.mail}</div>
          </div>
          <div class="order__row">
            <div class="order__info-title">Населений пункт</div>
            <div class="order__value">${delivery_info.deliveryCity}</div>
          </div>
          <div class="order__row">
            <div class="order__info-title">Тип доставки</div>
            <div class="order__value">
            ${
              delivery_info.deliveryType.type === 'postal'
                ? delivery_info.deliveryType.title
                : `вул.${delivery_info.deliveryType.street}, буд.${
                    delivery_info.deliveryType.house
                  },${
                    delivery_info.deliveryType.apartment
                      ? 'кв.' + delivery_info.deliveryType.apartment
                      : ''
                  }`
            }
            </div>
          </div>
          <div class="order__row">
          <div class="order__info-title">Оплата</div>
          <div class="order__value">${payment_info}</div>
          </div>
          <div class="order__row">
          <div class="order__info-title">Комментар</div>
          <div class="order__value">${contact_info.comment ? contact_info.comment : ''}</div>
          </div>
          <div class="order__row">
          <div class="order__info-title">Загальна сумма замовлення</div>
          <div class="order__value --total">${totalPrice} грн.</div>
          </div>

        </div>`;

      let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'justyn.marvin@ethereal.email',
          pass: 'uwqK19nfhwJVXhyaRE',
        },
      });

      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <justyn.marvin@ethereal.email>', // sender address
        to: 'vladishordiienko@gmail.com', // list of receivers
        subject: 'New order', // Subject line
        text: 'New Order', // plain text body
        html: html, // html body
      });
      return res.json('ok');
    } catch (error) {
      return res.status('404').json('Ошибка корзины');
    }
  }
}
module.exports = new basketController();
