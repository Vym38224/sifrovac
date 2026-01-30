import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../components/layout/HomeView.vue";
import CaesarView from "@/components/cipher/caesar/CaesarView.vue";
import AfinneView from "@/components/cipher/affine/AfinneView.vue";
import SubstitutionView from "@/components/cipher/substitution/SubstitutionView.vue";
import VigenereView from "@/components/cipher/vigenere/VigenereView.vue";
import StreamView from "@/components/cipher/stream/StreamView.vue";
import RsaCipherView from "@/components/cipher/rsa/RsaCipherView.vue";
import DesCipherView from "@/components/cipher/des/DesCipherView.vue";
import NotFoundView from "@/components/layout/NotFoundView.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/caesar", name: "Caesar", component: CaesarView },
  { path: "/affine", name: "Afinne", component: AfinneView },
  { path: "/substitution", name: "Substitution", component: SubstitutionView },
  { path: "/vigenere", name: "Vigenere", component: VigenereView },
  { path: "/stream", name: "Stream", component: StreamView },
  { path: "/rsa", name: "RSA", component: RsaCipherView },
  { path: "/des", name: "DES", component: DesCipherView },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
