<script setup>
import Daily from "@/components/Dashboard/Daily.vue";
import TopCus from "@/components/Dashboard/TopCus.vue";
import Monthly from "@/components/Dashboard/Monthly.vue";
import Yearly from "@/components/Dashboard/Yearly.vue";
</script>

<template>
  <section class="flex flex-col gap-5">
    <Daily />
    <Monthly />
    <Yearly />
    <TopCus />
  </section>
</template>
