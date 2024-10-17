import { BaseJob } from 'adonis-resque'
import puppeteer from 'puppeteer-extra'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'

interface ItemData {
  name: string
  text: string
  date: string
  rating: number | null
}

export default class ScraperJob extends BaseJob {
  // cron = '* */10 * * * *'
  // enqueue every five minutes
  async perform() {
    await this.scrape()
  }

  async scrape() {
    logger.info('scrape start')
    try {
      const data = await this.parse()
      const clearData: ItemData[] = data.map((item) => {
        item.date = this.parseDate(item.date)
        return item
      })
      logger.info(clearData)
    } catch (error) {
      console.error('Error closing browser: ', error)
    }
    logger.info('scrape stop')
  }

  async parse() {
    puppeteer.use(stealthPlugin())
    const launchOptions = {
      dumpio: true,
      headless: false,
      executablePath: puppeteer.executablePath(),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--incognito',
        '--disable-client-side-phishing-detection',
        '--disable-software-rasterizer',
      ],
    }
    const url = env.get('PARSE_URL_2GIS')

    const browser = await puppeteer.launch(launchOptions)
    try {
      const page = await browser.newPage()
      const userAgent = env.get('USER_AGENT')
      await page.setViewport({ width: 1920, height: 1080 })
      await page.setUserAgent(`${userAgent}`)
      await page.goto(`${url}`)
      await page.waitForNetworkIdle()
      await page.screenshot({
        path: 'screenshot_stealth.png',
      })
      logger.info('make screenshot')

      const items: ItemData[] = await page.evaluate(() => {
        return [
          ...Object.values(document.querySelectorAll('._h3pmwn')).map((item) => {
            return {
              name:
                item.parentElement.parentElement.parentElement.querySelector('._16s5yj36')
                  .childNodes[0].data || '',
              text: item.childNodes[0].data || '',
              date:
                item.parentElement.parentElement.parentElement.querySelector('._139ll30')
                  .childNodes[0].data || '',
              rating:
                item.parentElement.parentElement.parentElement.querySelector('._1fkin5c').childNodes
                  .length || null,
            }
          }),
          ...Object.values(document.querySelectorAll('._1oir7fah')).map((item) => {
            return {
              name:
                item.parentElement.parentElement.parentElement.querySelector('._16s5yj36')
                  .childNodes[0].data || '',
              text: item.childNodes[0].data || '',
              date:
                item.parentElement.parentElement.parentElement.querySelector('._139ll30')
                  .childNodes[0].data || '',
              rating:
                item.parentElement.parentElement.parentElement.querySelector('._1fkin5c').childNodes
                  .length || null,
            }
          }),
        ]
      })

      return items
    } catch (error) {
      logger.info(error)
    } finally {
      await browser.close()
    }
  }

  parseDate(dateString: string) {
    try {
      const splits = dateString.split(',')
      if (splits.length === 2) {
        return this.createDateObject(splits[0]).toISOString()
      }

      return this.createDateObject(dateString).toISOString()
    } catch (error) {
      logger.error('Error parsing date:', error)
      return ''
    }
  }

  createDateObject(dateString: string) {
    const [day, month, year] = dateString.split(' ')
    return new Date(Number(year), this.getMonthIndex(month), Number.parseInt(day, 10))
  }

  getMonthIndex(month: string) {
    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ]

    return months.indexOf(month)
  }
}
