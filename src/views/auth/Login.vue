<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { d$auth } from "@/stores/auth";
import { toast } from "vue3-toastify";

const router = useRouter();
const authStore = d$auth();

const input = reactive({
  phone: "",
  password: "",
});
const seePassword = ref(false);
const isLoading = ref(false);

const resetForm = () => {
  input.phone = "";
  input.password = "";
};

const submitForm = async () => {
  isLoading.value = true;
  try {
    await authStore.Api$Login(input);
    resetForm();
    router.replace({ name: "dashboard" });
  } catch (err) {
    if (err.response?.data?.responseMessage) {
      toast.error(err.response.data.responseMessage);
    } else if (err.response?.data?.errors?.phone) {
      toast.error(err.response.data.errors.phone);
    } else {
      toast.error("Gagal Membuat Akun");
    }
  } finally {
    isLoading.value = false;
  }
};

function handleSeePassword() {
  seePassword.value = !seePassword.value;
}
</script>

<template>
  <section class="max-w-screen-xl mx-auto w-full">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0 xl:h-screen w-full"
    >
      <div
        class="w-full bg-white rounded-lg shadow-lg dark:border sm:max-w-md md:mt-0 xl:w-1/3 p-10"
      >
        <div class="space-y-4 md:space-y-6">
          <h1
            class="text-lg font-bold leading-tight tracking-tight text-center text-gray-900 md:text-xl xl:text-2xl"
          >
            Silakan Login Terlebih Dahulu
          </h1>

          <form class="space-y-4 md:space-y-6" @submit.prevent="submitForm">
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
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Password</label
              >
              <div class="relative">
                <input
                  :type="seePassword ? 'text' : 'password'"
                  name="password"
                  id="password"
                  v-model="input.password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  required
                />
                <button
                  @click="handleSeePassword"
                  type="button"
                  class="absolute right-3 md:top-2.5 top-3 cursor-pointer text-gray-500"
                >
                  <v-icon v-if="seePassword" name="fa-eye" />
                  <v-icon v-else name="fa-eye-slash" />
                </button>
              </div>
            </div>
            <div class="flex justify-center w-full">
              <div class="flex flex-col gap-2 items-center">
                <button
                  type="submit"
                  class="cursor-pointer w-36 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 text-center"
                  :class="
                    isLoading
                      ? 'bg-blue-300 cursor-not-allowed py-0'
                      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer py-2'
                  "
                >
                  <span v-if="!isLoading">Login</span>
                  <Vue3Lottie
                    v-else
                    animationLink="/loading.json"
                    :height="35"
                    :width="35"
                    :loop="true"
                    :autoplay="true"
                    class="p-0 m-0"
                  />
                </button>

                <div class="md:text-sm text-base text-gray-600">
                  Belum Punya Akun?
                  <router-link
                    to="/auth/register"
                    class="Font-bold hover:underline text-black"
                  >
                    Register
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
