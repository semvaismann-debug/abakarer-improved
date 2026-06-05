const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

  const { name, phone, product, volume, comment } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'aba-priemnay@yandex.ru',
      pass: process.env.MAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: '"Сайт abakarer.ru" <aba-priemnay@yandex.ru>',
      to: 'aba-priemnay@yandex.ru',
      subject: 'Новая заявка — Абагурский карьер',
      text: `Имя: ${name || 'не указано'}\nТелефон: ${phone}\nПродукция: ${product || 'не выбрано'}\nОбъём: ${volume || 'не указано'}\nКомментарий: ${comment || 'нет'}`,
      html: `<h2>Новая заявка с сайта abakarer.ru</h2><table><tr><td><b>Имя</b></td><td>${name || 'не указано'}</td></tr><tr><td><b>Телефон</b></td><td>${phone}</td></tr><tr><td><b>Продукция</b></td><td>${product || 'не выбрано'}</td></tr><tr><td><b>Объём</b></td><td>${volume || 'не указано'}</td></tr><tr><td><b>Комментарий</b></td><td>${comment || 'нет'}</td></tr></table>`
    });
    res.status(200).json({success: true});
  } catch(e) {
    console.error(e);
    res.status(500).json({error: e.message});
  }
}
