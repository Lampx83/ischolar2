import HomePage from "@/components/HomePage";
import {createRouter, createWebHashHistory} from "vue-router";
import MapPage from "@/components/MapPage";
import PublishPage from "@/components/PublishPage";
// import JsMindPage from "@/components/JsMindPage";

const routes = [
    // {path: '/', name: 'homepage', component: JsMindPage},
    {path: '/', name: 'homepage', component: HomePage},
    {path: '/map/:id', name: 'map', component: MapPage},

    {path: '/publish/:id', name: 'publish', component: PublishPage}
]
export const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})