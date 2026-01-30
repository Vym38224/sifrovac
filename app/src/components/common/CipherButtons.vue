<!-- Komponenta pro tlačítka -->
<template>
  <section class="button-group" role="group">
    <button
      class="btn-encrypt"
      @click="$parent.sifrovat()"
      :disabled="disableEncrypt"
    >
      Zašifrovat
    </button>
    <button
      class="btn-decrypt"
      @click="$parent.desifrovat()"
      :disabled="disableDecrypt"
    >
      Dešifrovat
    </button>
    <button
      class="btn-delete"
      @click="$parent.vymazatVse()"
      :disabled="disableClear"
    >
      Vymazat
    </button>
  </section>
</template>

<script>
import "@/assets/styles/common/buttons.css";
export default {
  name: "CipherButtons",
  props: {
    disableEncrypt: {
      type: Boolean,
      default: false,
    },
    disableDecrypt: {
      type: Boolean,
      default: false,
    },
    disableClear: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
