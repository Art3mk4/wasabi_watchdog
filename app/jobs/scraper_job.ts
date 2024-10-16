import { BaseJob } from 'adonis-resque'
import logger from '@adonisjs/core/services/logger'
export default class ScraperJob extends BaseJob {
  cron = '*/1 * * * * *'
  // enqueue every five minutes
  interval = '5m'
  async perform() {
    logger.info(`Repeater every 5 minutes / every seconds`)
  }
}
