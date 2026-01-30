import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import CipherToast from "./components/common/CipherToast.vue";
import CipherHeader from "./components/common/CipherHeader.vue";
import CipherTextarea from "./components/common/CipherTextarea.vue";
import CipherButtons from "./components/common/CipherButtons.vue";
import CipherInfo from "./components/common/CipherInfo.vue";

const app = createApp(App).use(router);

app.component("CipherToast", CipherToast);
app.component("CipherHeader", CipherHeader);
app.component("CipherTextarea", CipherTextarea);
app.component("CipherButtons", CipherButtons);
app.component("CipherInfo", CipherInfo);

app.mount("#app");
