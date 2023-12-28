import {createApp} from 'vue'
import App from './App.vue'

import 'vuetify/styles';
import {createVuetify} from 'vuetify'
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {store} from "@/store/store";
import {initialize} from "../initialize";

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi
        },
    }
});

const app = createApp(App)
app.use(vuetify)
app.use(store);
initialize().then(() => {
    app.mount('#app')
})