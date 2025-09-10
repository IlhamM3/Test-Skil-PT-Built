<script setup>
import { ref, onMounted } from "vue";
import { d$Customer } from "@/stores/customer";
const StoreCus = d$Customer();
import { toast } from "vue3-toastify";

const isLoading = ref(false);
const nama = ref("");
const identityNo = ref("");
const npwp = ref("");
const email = ref("");
const phone = ref("");
const mobile_phone = ref("");
const alamat = ref("");

const props = defineProps({
  idModal: String,
  idCustomer: String,
  params: Object,
});

const EditCustomer = async () => {
  isLoading.value = true;

  const body = {
    name: nama.value,
    identityNo: identityNo.value || null,
    npwp: npwp.value || null,
    email: email.value || null,
    phone: phone.value || null,
    mobilePhone: mobile_phone.value || null,
    address: alamat.value || null,
  };

  try {
    await StoreCus.Api$EditCustomer(props.idCustomer, body);
    toast.success("Data Customer berhasil diubah");
    console.log(props.params);
    await StoreCus.Api$CusParams(props.params);
  } catch (err) {
    toast.error(err.response?.data?.errors?.name || "Gagal Mengubah data");
  } finally {
    isLoading.value = false;
  }
};

const GetCustometbyId = async (id) => {
  try {
    const data = await StoreCus.Api$DetailCustomer(id);
    nama.value = data.name;
    identityNo.value = data.identityNo;
    npwp.value = data.npwp;
    email.value = data.email;
    phone.value = data.phone;
    mobile_phone.value = data.mobilePhone;
    alamat.value = data.address;
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await GetCustometbyId(props.idCustomer);
});
</script>

<template>
  <div
    :id="idModal"
    tabindex="-1"
    aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative p-4 w-full max-w-4xl max-h-full">
      <div class="relative bg-white rounded-md shadow-sm">
        <div
          class="flex items-center justify-between px-2 py-2.5 md:px-4 md:py-4 border-b rounded-t border-gray-200"
        >
          <h3 class="text-base md:text-xl font-semibold text-gray-900">
            Edit Data Customer
          </h3>
          <button
            type="button"
            class="cursor-pointer end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            :data-modal-hide="idModal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5">
          <form
            class="grid grid-cols-1 md:grid-cols-2 gap-5 font-[400]"
            @submit.prevent="EditCustomer"
          >
            <div class="relative w-full">
              <label
                for="nama"
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Nama Lengkap *
              </label>
              <input
                v-model="nama"
                type="text"
                id="nama"
                required
                placeholder="Masukan nama"
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
              />
            </div>
            <div class="relative w-full">
              <label
                for="identityNo"
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Nomor Identitas
              </label>
              <input
                v-model="identityNo"
                type="text"
                id="identityNo"
                placeholder="Masukan identityNo"
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
              />
            </div>
            <div class="relative w-full">
              <label
                for="npwp"
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                No NPWP
              </label>
              <input
                v-model="npwp"
                type="text"
                id="npwp"
                placeholder="Masukan No NPWP"
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
              />
            </div>
            <div class="relative w-full">
              <label
                for="email"
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Email
              </label>
              <input
                v-model="email"
                type="email"
                id="email"
                placeholder="Masukan email"
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
              />
            </div>
            <div class="relative w-full">
              <label
                for="phone"
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Nomor Telepon
              </label>
              <input
                v-model="phone"
                type="text"
                id="phone"
                placeholder="Masukan phone"
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
              />
            </div>
            <div class="relative w-full">
              <label
                for="mobile_phone"
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Mobile Phone
              </label>
              <input
                v-model="mobile_phone"
                type="text"
                id="mobile_phone"
                placeholder="Masukan Mobile Phone"
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
              />
            </div>

            <div class="relative w-full col-span-1 md:col-span-2">
              <label
                for="alamat"
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Alamat *
              </label>
              <textarea
                v-model="alamat"
                rows="3"
                id="alamat"
                required
                placeholder="Masukan alamat"
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 ring-0"
              />
            </div>

            <button
              type="submit"
              :disabled="!nama || isLoading"
              class="md:col-span-2 text-white font-medium rounded-md text-sm px-5 flex justify-center items-center text-center"
              :class="
                !nama || isLoading
                  ? 'bg-gray-400 cursor-not-allowed py-0'
                  : 'bg-green-500 hover:bg-green-400 cursor-pointer py-2'
              "
            >
              <span v-if="!isLoading">Edit Data</span>
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
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
