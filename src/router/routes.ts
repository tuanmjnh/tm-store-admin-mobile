import Layout from '@/layouts/index.vue'
import type { RouteRecordRaw } from 'vue-router'
import Demo from '@/views/demo/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'root',
    component: Layout,
    redirect: { name: 'Demo' },
    children: [
      {
        path: 'demo',
        name: 'Demo',
        component: Demo,
        meta: {
          title: 'Home'
        }
      },
      {
        path: 'tools',
        name: 'Tools',
        component: () => import('@/views/tools/index.vue'),
        meta: {
          title: 'Tool'
        }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/about/index.vue'),
        meta: {
          title: 'About',
          noCache: true
        }
      }
    ]
  }
]

export default routes
