/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import ScraperJob from '#jobs/scraper_job'

const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
  })
  .prefix('user')

router
  .get('/', async () => {
    await ScraperJob.enqueue()
    return {
      hello: 'world',
    }
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
