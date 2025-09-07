<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { d$auth } from "@/stores/auth";

const router = useRouter();
const authStore = d$auth();

const input = reactive({
  name: "",
  phone: "",
  email: "",
  address: "",
  password: "",
});

const errorMessage = ref("");

const resetForm = () => {
  input.name = "";
  input.phone = "";
  input.email = "";
  input.address = "";
  input.password = "";
};

const submitForm = async () => {
  try {
    await authStore.Api$Register(input);
    resetForm();
    router.replace({ name: "dashboard" });
  } catch (err) {
    console.error(err);
    errorMessage.value = err || "Login gagal";
  }
};
</script>

<template>
  <section class="max-w-screen-xl mx-auto w-full">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0 xl:h-screen w-full"
    >
      <div
        class="w-full bg-white rounded-lg shadow-lg dark:border sm:max-w-md md:mt-0 p-5 md:p-10"
      >
        <div class="space-y-4 md:space-y-6">
          <h1
            class="text-lg font-bold leading-tight tracking-tight text-center text-gray-900 md:text-xl xl:text-2xl"
          >
            Silakan Daftar Terlebih Dahulu
          </h1>

          <p v-if="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
          </p>

          <form class="space-y-4 md:space-y-3" @submit.prevent="submitForm">
            <div>
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Nama Lengkap</label
              >
              <input
                type="text"
                name="name"
                id="name"
                v-model="input.name"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Masukkan Nama Anda"
                required
              />
            </div>
            <div>
              <label
                for="phone"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Nomor Handphone</label
              >
              <input
                type="text"
                name="phone"
                id="phone"
                v-model="input.phone"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Contoh: 082123456789"
                required
              />
            </div>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Email</label
              >
              <input
                type="email"
                name="email"
                id="email"
                v-model="input.email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="contoh@gmail.com"
                required
              />
            </div>
            <div>
              <label
                for="address"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Masukkan Alamat Anda</label
              >
              <textarea
                rows="2"
                name="adress"
                id="adress"
                v-model="input.address"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Masukkan Alamat Anda"
                required
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                v-model="input.password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                required
              />
            </div>
            <div class="flex justify-center w-full pt-2">
              <div class="flex flex-col gap-2 items-center">
                <button
                  type="submit"
                  class="cursor-pointer w-36 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Register
                </button>
                <div class="md:text-sm text-base text-gray-600">
                  Sudah Punya Akun?
                  <router-link
                    to="/auth/login"
                    class="Font-bold hover:underline text-black"
                  >
                    Login
                  </router-link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
