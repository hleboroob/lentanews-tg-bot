/*const Telegraf = require('telegraf')
const config = require('./config.json')
const TelegatmBot = require('node-telegram-bot-api')
const _ = require('lodash')
const fs = require('fs')
const request = require('request')
const axios = require('axios')
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('9a58e204b544439ab469f455b13a2e6c');
const bot = new Telegraf(config.token,{
    polling:true
})
const now = new Date()
var photos= {}*/
/*
    newsapi.v2.everything({

        sources: 'ria-news',
        domains: 'ria.ru',
        frm: now.toLocaleDateString(),
        to: now.toLocaleDateString(),
        language: 'ru',
        sortBy: 'publishedAt',
        pageSize: 2,
        page: 1
    }).then(response => {
        // const data = response()
        response.articles.forEach(function (item) {

            const image = item.urlToImage

            console.log(image)
        })

    })


bot.startPolling()*/
/*bot.start((ctx) => {
    photos[ctx.from.id]=[]
    return ctx.reply('Please, send me from 2 to 10 photos\nSend /done to crear album or /cancel to abort operation')
})
bot.command('/cancel',(ctx)=>photos[ctx.from.id]=[])
bot.command('/done',(ctx)=>{
    if(photos[ctx.from.id].length < 2 || photos[ctx.from.id].length > 10) return
    done(ctx)
})
bot.on('photo',(ctx)=>{
    const lastPhoto = ctx.message.photo.length - 1
    photos[ctx.from.id] = photos[ctx.from.id] || []
    photos[ctx.from.id].push({type:'photo', media: ctx.message.photo[lastPhoto].file_id})
    if(photos[ctx.from.id].length > 10){
        done(ctx)
    }
})
function  done(ctx) {
    ctx.replyWithMediaGroup(photos[ctx.from.id])
    photos[ctx.from.id]=[]

}

bot.on('text', ctx => {

    const subreddit = ctx.message.text
    axios.get(`https://reddit.com/r/${subreddit}/top.json?limit=10`)
        .then(res => {
            const data = res.data.data
            if (data.children.length < 1)
                return ctx.reply('The subreddit couldn\'t be found.')
            const link = `https://ria.ru/society/20180326/1517253297.html`
            return ctx.reply(link)
        })

        .catch(err => console.log(err))
})*/
//const axios = require('axios')
const config = require('./config.json')
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('9a58e204b544439ab469f455b13a2e6c');
//const weatherapi = new WeatherAPI('989dd010961b0849')
const TelegatmBot = require('node-telegram-bot-api')
const _ = require('lodash')
const fs = require('fs')
const request = require('request')
const Token = '543758214:AAHJIAjxvoCqMN3AvReinXTWnVVCxzY4wkM'
const currentBool = true
const now = new Date()
const bot = new TelegatmBot(Token, {
    polling:true
})
const axios = require('axios'); // add axios

const KB = {
    currency:'📊Курс валюты📊',
    currencyCripto:'Крипто валюты',
    currencyNational:'Национальные валюты',
    weather:'🌝Погода🌝',
    news:'📰Новости📰',
    horoscope:'☯Гороскоп☯',
    cinema:'📺Кино📺',
    picture:'Картинdfgdfgка',
    cat:'Кот',
    car:'машина',
    back:'Назад'
}
const  PicScrs = {
    [KB.car]:[
        'car1.jpg',
        'car2.jpg',
        'car3.jpg'
    ],
    [KB.cat]:[
        'cat1.jpg',
        'cat2.jpg',
        'cat3.jpg'
    ]
}
bot.onText(/\/start/, msg=> {
   sendGreeting(msg)
})
bot.on('message', msg => {
    switch (msg.text){
        case KB.picture:
            sendPictureScreen(msg.chat.id)
            break
        case KB.currency:
            bot.sendMessage(msg.chat.id, `Выберите тип валюты ⬇`, {
                reply_markup:{
                    keyboard:[
                        [KB.currencyCripto], [KB.currencyNational],[KB.back]
                    ]
                }
            })
            break
        case KB.cat:
        case KB.car:
            sendPictureByName(msg.chat.id, msg.text)
            break
        case KB.back:
            sendGreeting(msg, false)
            break
        case KB.weather:
            sendWeatherScreen(msg.chat.id)
            break
        case KB.currencyNational:
            sendCurrencyNationalScreen(msg.chat.id)
            break
        case KB.currencyCripto:
            sendCurrencyCriptoScreen(msg.chat.id)
            break
        case KB.news:
            sendNews(msg.chat.id)
            break
    }
})
bot.on('callback_query',query=>{
    const base = query.data
    const symbol = 'RUB'
    bot.answerCallbackQuery({
        callback_query_id:query.id,
        text:`Вы выбрали ${base}`
    })
    //console.log(query.data)
    if ((query.data == "usd")||(query.data == "eur"))
    request(`http://api.fixer.io/latest?syimbols=${symbol}&base=${base}`,(error,response,body)=>{
        if (error) throw new  Error(error)
        if (response.statusCode===200){
            const currencyData = JSON.parse(body)
           // console.log(body)
            const html = `<b>1 ${base} </b> - <em> ${currencyData.rates[symbol]} ${symbol}</em>`
            bot.sendMessage(query.message.chat.id,html,{
                parse_mode:'HTML'
            })

        }
    })
    else
        request(`https://min-api.cryptocompare.com/data/price?fsym=${base}&tsyms=${symbol}`,(error,response,body)=> {
            if (error) throw new  Error(error)
            if (response.statusCode===200){

                const currencyData = JSON.parse(body)
               //currencyData[symbol])

                const html = `<b>1 ${base} </b> - <em> ${currencyData [symbol]} ${symbol}</em>`

                bot.sendMessage(query.message.chat.id,html,{
                    parse_mode:'HTML'
                })

            }
        })
    //console.log(JSON.stringify(query,null,2))
})
function sendWeatherScreen(chatId) {
    bot.sendMessage(chatId, `Напишите город(в формате "Moscow")`, {
                reply_markup: {
                    remove_keyboard: true
                }
            })
    bot.on('message', msg => {
        request(`http://api.wunderground.com/api/989dd010961b0849/forecast/geolookup/conditions/q/Russia.json`, (error, response, body) => {
            if (error) throw new Error(error)
            if (response.statusCode === 200) {
                const currencyData = JSON.parse(body)
                currencyData.response.results.forEach(function (item){
                    const name = item.name
                   // console.log(name)
                    if (msg.text == name){
                        request(`http://api.wunderground.com/api/989dd010961b0849/conditions/q/RU/${name}.json`, (error, response, body) => {
                            if (error) throw new Error(error)
                            if (response.statusCode === 200) {
                                const currencyData = JSON.parse(body)
                                const temperatrue = currencyData.current_observation.temperature_string
                                bot.sendMessage(chatId,`Температура в ваше городе ${temperatrue}`)
                                sendGreeting(msg, false)
                                draw
                                //console.log(temperatrue)
                                /* currencyData.response.forEach(function (item){
                                     console.log(item)
                                 })*/
                                // const currencyData1 = JSON.parse(body)
                                // console.log(body)
                                /* currencyData1.current_observation.forEach(function (item1){
                                     console.log(item1)
                                 })*/
                            }
                        })
                    }
                })

            }
            /*request(`http://api.fixer.io/latest?syimbols=${symbol}&base=${base}`, (error, response, body) => {
            if (error) throw new Error(error)
            if (response.statusCode === 200) {
                const currencyData = JSON.parse(body)
                console.log(body)
                const html = `<b>1 ${base} </b> - <em> ${currencyData.rates[symbol]} ${symbol}</em>`
                bot.sendMessage(query.message.chat.id, html, {
                    parse_mode: 'HTML'
                })

            }
        })*/
        })
    })

           //sendGorodWeather(chatId)
}

function WeatherJSON(chatId,name) {
 imag
}
function sendPictureScreen(chatId) {
    bot.sendMessage(chatId,`выберите тип картинки`,{
        reply_markup:{
            keyboard:[
                [KB.car, KB.cat],
                [KB.back]
            ],
            remove_keyboard: false
        }
    })
}
function sendGreeting(msg, sayHello = true) {
    const text =  sayHello
        ?`Приветствую, ${msg.from.first_name}\n Что вы хотите сделать?`
        :`Что вы хотите сделать? `
    bot.sendMessage(msg.chat.id, text, {
        reply_markup:{
            keyboard:[
                [KB.currency, KB.news],
                [KB.weather]
            ]
        }
    })
}
function sendPictureByName(chatId, picName) {
    const srcs = PicScrs[picName]
    console.log(srcs)
    const src = srcs[_.random(0, srcs.length-1)]
    bot.sendMessage(chatId,`Загружаю...`)
    fs.readFile(`${__dirname}/pictures/${src}`, (error,picture)=>{
        if(error) throw new Error(error)
        bot.sendPhoto(chatId,picture).then(()=>{
            bot.sendMessage(chatId,`Отправлено⌚!`)
        })
    })
}
function sendCurrencyNationalScreen(chatId) {
    bot.sendMessage(chatId,`Выберите тип валюты ⬇`,{
        reply_markup:{
            inline_keyboard:[
                [
                    {
                        text:'Доллар',
                        callback_data:'usd'
                    }
                ],
                [
                    {
                        text: 'Евро',
                        callback_data: 'eur'
                    }
                ]
            ]
        }

    })
}
function sendCurrencyCriptoScreen(chatId) {
    bot.sendMessage(chatId,`Выберите тип валюты ⬇`,{
        reply_markup:{
            inline_keyboard:[
                [
                    {
                        text:'Биткоин',
                        callback_data:'BTC'
                    }
                ],
                [
                    {
                        text: 'Эфириум',
                        callback_data: 'ETH'
                    }
                ]
            ]
        }

    })
}
function sendNews(chatId) {
    newsapi.v2.everything({

        sources: 'ria-news',
        domains: 'ria.ru',
        frm: now.toLocaleDateString(),
        to: now.toLocaleDateString(),
        language: 'ru',
        sortBy: 'publishedAt',
        pageSize: 10,
        page: 1
    }).then(response => {
        // const data = response()
        response.articles.forEach(function (item) {
            console.log(response)
            const image = item.urlToImage
            const titleItem = item.title
            const url = item.url
            const title = titleItem.replace('- РИА Новости','')

            const mes = `${title}\n${url}`
            bot.sendMessage(chatId,mes,{
                disable_web_page_preview:true
            })
           /* bot.sendPhoto(chatId,image).then(()=>{
                bot.sendMessage(chatId,url)
            })*/
        })
    })
}






/*bot.on('text', ctx => {
    bot.on('text', ctx => {
    axios.get(`https://www.reddit.com/new/`)
        .then(res => {
            const data = res.data.data;
            if (data.children.length < 1)
                return ctx.reply('The subreddit couldn\'t be found.');
            const link = `https://reddit.com/${data.children[0].data.permalink}`;
            return ctx.reply(link);
        })
        .catch(err => console.log(err));
    })
})
*/