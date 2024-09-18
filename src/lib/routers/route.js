import Home from '../routers/home/index.svelte'
import About from '../routers/about/index.svelte'
import Contact from '../routers/contact/index.svelte'
import ErrorPage from '../routers/error/index.svelte'
import MetabusIntroduce from '../routers/about/metabus/index.svelte'
import AIDataIntroduce from '../routers/about/AIData/index.svelte'
import NetworkIntroduce from '../routers/about/network/index.svelte'
import WebIntroduce from '../routers/about/web/index.svelte'

export default {
    '/' : Home,
    '/about' : About,
    '/about/metabus' : MetabusIntroduce,
    '/about/AIData'  : AIDataIntroduce,
    '/about/Network' : NetworkIntroduce,
    '/about/Web'     : WebIntroduce,
    '/contact' : Contact,
    '*' : ErrorPage
}