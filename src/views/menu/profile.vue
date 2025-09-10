<script setup>
import { ref, onMounted } from "vue";
import { d$auth } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
const authStore = d$auth();
const { GetDataProfile } = storeToRefs(authStore);
const isLoading = ref(false);
const isLoadingProfile = ref(false);
const DataProfile = ref([]);
const currentPassword = ref("");
const newPassword = ref("");
const newPasswordConfirmation = ref("");

onMounted(async () => {
  if (!DataProfile.value) {
    await GetProfile();
    DataProfile.value = GetDataProfile.value;
  } else {
    DataProfile.value = GetDataProfile.value;
  }
});

const GetProfile = async () => {
  isLoadingProfile.value = true;
  try {
    await authStore.Api$Profile();
  } catch (err) {
    console.error(err);
    errorMessage.value = err || "Logout gagal";
  } finally {
    isLoadingProfile.value = false;
  }
};

const EditPassword = async () => {
  isLoading.value = true;

  const body = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
    newPasswordConfirmation: newPasswordConfirmation.value,
  };

  try {
    const data = await authStore.Api$PutPassword(body);
    currentPassword.value = "";
    newPassword.value = "";
    newPasswordConfirmation.value = "";
    toast.success("Password Berhasil Diubah");
  } catch (err) {
    currentPassword.value = "";
    newPassword.value = "";
    newPasswordConfirmation.value = "";
    if (err.response?.data?.errors?.newPassword) {
      toast.error(err.response.data.errors.newPassword);
    } else if (err.response?.data?.errors?.currentPassword) {
      toast.error(err.response.data.errors.currentPassword);
    } else if (err.response?.data?.errors?.newPasswordConfirmation) {
      toast.error(err.response.data.errors.newPasswordConfirmation);
    } else {
      toast.error("Gagal Mengubah Password");
    }
  } finally {
    isLoading.value = false;
  }
};

const showPassword = ref({
  current: false,
  new: false,
  confirm: false,
});

function togglePassword(field) {
  showPassword.value[field] = !showPassword.value[field];
}
</script>

<template>
  <section
    class="flex flex-col gap-5 border-gray-300 border flex-1 p-6 bg-gray-50 rounded-lg"
  >
    <div class="grid md:grid-cols-7 grid-cols-1 gap-5">
      <div
        class="col-span-1 md:col-span-2 md:border-r md:border-gray-300 md:pr-4"
      >
        <div class="relative w-full h-full border border-gray-300 rounded-md">
          <img
            :src="DataProfile.profileImage"
            alt="Photo Profile"
            class="rounded-md w-full h-full object-cover"
          />
          <div
            v-if="isLoadingProfile"
            class="absolute inset-0 z-40 flex items-center justify-center bg-gray-900/20"
          >
            <Vue3Lottie
              animationLink="/loading.json"
              :height="120"
              :width="120"
              :loop="true"
              :autoplay="true"
              class="p-0 m-0"
            />
          </div>
        </div>
      </div>
      <div class="col-span-1 md:col-span-5 flex flex-col gap-5">
        <h1 class="text-lg md:text-2xl font-semibold">Informasi data diri</h1>
        <div class="grid md:grid-cols-2 grid-cols-1 gap-5">
          <div class="relative w-full">
            <h1
              class="absolute -top-2 left-2 px-1 bg-gray-50 text-xs text-gray-700"
            >
              Nama Lengkap
            </h1>
            <div
              class="w-full rounded-md px-3 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
            >
              {{ DataProfile.name || "-" }}
            </div>
          </div>
          <div class="relative w-full">
            <h1
              class="absolute -top-2 left-2 px-1 bg-gray-50 text-xs text-gray-700"
            >
              Email
            </h1>
            <div
              class="w-full rounded-md px-3 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
            >
              {{ DataProfile.email || "-" }}
            </div>
          </div>
          <div class="relative w-full">
            <h1
              class="absolute -top-2 left-2 px-1 bg-gray-50 text-xs text-gray-700"
            >
              Phone
            </h1>
            <div
              class="w-full rounded-md px-3 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
            >
              {{ DataProfile.phone || "-" }}
            </div>
          </div>
          <div class="relative w-full">
            <h1
              class="absolute -top-2 left-2 px-1 bg-gray-50 text-xs text-gray-700"
            >
              Role
            </h1>
            <div
              class="w-full rounded-md px-3 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
            >
              {{ DataProfile.roleName || "-" }}
            </div>
          </div>
        </div>
        <h1 class="text-sm md:text-base font-semibold">Ubah Password</h1>
        <div class="md:col-span-2 col-span-1">
          <form
            class="grid grid-cols-1 md:grid-cols-2 gap-5 font-[400]"
            @submit.prevent="EditPassword"
          >
            <div class="relative w-full">
              <label
                for="CurrentPass"
                class="absolute -top-2 z-40 left-2 px-1 bg-gray-50 text-xs text-gray-700"
              >
                Password Saat ini *
              </label>
              <div class="relative">
                <input
                  v-model="currentPassword"
                  :type="showPassword.current ? 'text' : 'password'"
                  id="CurrentPass"
                  required
                  placeholder="*******"
                  class="w-full rounded-md px-3 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
                />
                <button
                  @click="togglePassword('current')"
                  type="button"
                  class="absolute right-3 top-2 cursor-pointer text-gray-700"
                >
                  <v-icon v-if="showPassword.current" name="fa-eye" />
                  <v-icon v-else name="fa-eye-slash" />
                </button>
              </div>
            </div>
            <div class="relative w-full">
              <label
                for="NewPass"
                class="absolute -top-2 left-2 z-40 px-1 bg-gray-50 text-xs text-gray-700"
              >
                Password Baru *
              </label>
              <div class="relative">
                <input
                  v-model="newPassword"
                  :type="showPassword.newPass ? 'text' : 'password'"
                  id="NewPass"
                  required
                  placeholder="*******"
                  class="w-full rounded-md px-3 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
                />
                <button
                  @click="togglePassword('newPass')"
                  type="button"
                  class="absolute right-3 top-2 cursor-pointer text-gray-700"
                >
                  <v-icon v-if="showPassword.newPass" name="fa-eye" />
                  <v-icon v-else name="fa-eye-slash" />
                </button>
              </div>
            </div>
            <div class="relative w-full">
              <label
                for="ConfirmPass"
                class="absolute -top-2 z-40 left-2 px-1 bg-gray-50 text-xs text-gray-700"
              >
                Konfirmasi Password Baru *
              </label>
              <div class="relative">
                <input
                  v-model="newPasswordConfirmation"
                  :type="showPassword.ConfimNewPass ? 'text' : 'password'"
                  id="ConfirmPass"
                  required
                  placeholder="*******"
                  class="w-full rounded-md px-3 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
                />
                <button
                  @click="togglePassword('ConfimNewPass')"
                  type="button"
                  class="absolute right-3 top-2 cursor-pointer text-gray-700"
                >
                  <v-icon v-if="showPassword.ConfimNewPass" name="fa-eye" />
                  <v-icon v-else name="fa-eye-slash" />
                </button>
              </div>
            </div>
            <div class="w-full flex items-center justify-end">
              <button
                type="submit"
                :disabled="
                  !newPassword ||
                  !currentPassword ||
                  !newPasswordConfirmation ||
                  isLoading
                "
                class="text-white font-medium rounded-md text-sm w-16 h-8 flex justify-center items-center text-center"
                :class="
                  !newPassword ||
                  !currentPassword ||
                  !newPasswordConfirmation ||
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed '
                    : 'bg-green-500 hover:bg-green-400 cursor-pointer '
                "
              >
                <span v-if="!isLoading">Ubah</span>
                <Vue3Lottie
                  v-else
                  animationLink="/loading.json"
                  :height="25"
                  :width="25"
                  :loop="true"
                  :autoplay="true"
                  class="p-0 m-0"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
