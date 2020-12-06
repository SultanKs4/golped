import puppeteer from 'puppeteer'
import fs from 'fs/promises'

let scrap = async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://www.tokopedia.com/emas/harga-hari-ini/')
    const date = await page.$eval('time', el => el.textContent)
    const price = await page.$$eval('span.main-price', element =>
        element.map(val => val.textContent)
    )
    await browser.close()

    let gold = {
        date: date,
        buy: price[0]?.replace(/^Rp/, ''),
        sell: price[1]?.replace(/^Rp/, ''),
        lastUpdate: new Date(Date.now()).toUTCString(),
    }
    return gold
}

try {
    const fName = './db.json'
    let gold = {
        data: await scrap(),
    }
    fs.writeFile(fName, JSON.stringify(gold, undefined, 2))
} catch (err) {
    console.log(err)
}
