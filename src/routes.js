import HomePage from "@/components/HomePage";
import {createRouter, createWebHashHistory} from "vue-router";
import MapPage from "@/components/MapPage";
import PublishPage from "@/components/PublishPage";

const routes = [
    {path: '/', name: 'homepage', component: HomePage},
    {path: '/map/:id', name: 'map', component: MapPage},
    {path: '/publish', name: 'publish', component: PublishPage}
]
export const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})