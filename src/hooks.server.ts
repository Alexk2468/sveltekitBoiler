import PocketBase from 'pocketbase' 
import { serializeNonPOJOs } from './lib/utils'

export const handle = async ({ event, resolve }: any) => {
    event.locals.pb = new PocketBase('https://ims.pockethost.io')  // http://127.0.0.1:8090
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
    
    if (event.locals.pb.authStore.isValid) {
        event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model)
    } else {
        event.locals.user = undefined
    }

    const response = await resolve(event)
      
    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie()) //{ secure: true, httpOnly: false}
    
    return response
}