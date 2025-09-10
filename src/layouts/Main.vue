<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { onBeforeMount } from "vue";

onBeforeMount(() => {
  sessionStorage.clear();
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <div class="p-4 sm:ml-64 rounded-lg">
      <main class="mt-14">
        <router-view />
      </main>
      <Footer />
    </div>
  </div>
</template>
