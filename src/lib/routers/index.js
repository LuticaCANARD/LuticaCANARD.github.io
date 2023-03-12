import Webasm from './webasm.svelte'
import Posts from './posts.svelte';
import Profile from './profile.svelte';
import Document from './document.svelte';
import Rpmap from './map_title.svelte'

export default {
    '/': Profile,
    '/Profile': Profile,
    '/webasm': Webasm,
    '/Posts': Posts,
    '/Rpmap': Rpmap,
    '/Document/:id':Document

  };
