import Home from '../routers/home/index.svelte'
import About from '../routers/about/index.svelte'
import Contact from '../routers/contact/index.svelte'
import ErrorPage from '../routers/error/index.svelte'
export default {
    '/' : Home,
    '/about' : About,
    '/contact' : Contact,
    '*' : ErrorPage
}