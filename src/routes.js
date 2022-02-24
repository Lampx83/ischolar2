import HomePage from "@/components/HomePage";
import UserDetail from "@/components/UserDetail";
import {createRouter, createWebHashHistory} from "vue-router";
import MapPage from "@/components/MapPage";
import PublishPage from "@/components/PublishPage";

const routes = [
    {path: '/', name: 'homepage', component: HomePage},
    {path: '/user', name: 'user', component: UserDetail},
    {path: '/map', name: 'map', component: MapPage},
    {path: '/publish', name: 'publish', component: PublishPage}
]
export const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})