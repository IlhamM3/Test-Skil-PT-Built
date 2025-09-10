<script setup>
import { ref, onMounted, watch } from "vue";
import { d$Customer } from "@/stores/customer";
const StoreCus = d$Customer();
import { storeToRefs } from "pinia";
const { GetResPutCus } = storeToRefs(StoreCus);
import { initFlowbite } from "flowbite";
const nama = ref("");
const selectedCity = ref();
const selectedProvince = ref();
const identityNo = ref("");
const npwp = ref("");
const email = ref("");
const phone = ref("");
const mobile_phone = ref("");
const alamat = ref("");
const tipeCompany = ref("");

const props = defineProps({
  idModal: String,
  idCustomer: String,
});

const GetCustomerbyId = async (id) => {
  try {
    const data = await StoreCus.Api$DetailCustomer(id);
    nama.value = data.name;
    identityNo.value = data.identityNo;
    npwp.value = data.npwp;
    email.value = data.email;
    phone.value = data.phone;
    mobile_phone.value = data.mobilePhone;
    alamat.value = data.address;
    tipeCompany.value = data.companyType;
    selectedProvince.value = data.province.name;
    selectedCity.value = data.city.name;
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  GetCustomerbyId(props.idCustomer);
  setTimeout(() => {
    initFlowbite();
  }, 1000);
});

watch(GetResPutCus, (newVal) => {
  if (newVal?.code && newVal.code === props.idCustomer) {
    nama.value = newVal.name;
    identityNo.value = newVal.identityNo;
    npwp.value = newVal.npwp;
    email.value = newVal.email;
    phone.value = newVal.phone;
    mobile_phone.value = newVal.mobilePhone;
    alamat.value = newVal.address;
    tipeCompany.value = newVal.companyType;
    selectedProvince.value = newVal.province.name;
    selectedCity.value = newVal.city.name;
  }
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
            Detail Data Customer
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="relative w-full">
              <div
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Nama
              </div>
              <div
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 h-[40px]"
              >
                {{ nama }}
              </div>
            </div>
            <div class="relative w-full">
              <div
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Nomor Identitas
              </div>
              <div
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 h-[40px]"
              >
                {{ identityNo || "-" }}
              </div>
            </div>
            <div class="relative w-full">
              <div
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                No NPWP
              </div>
              <div
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 h-[40px]"
              >
                {{ npwp || "-" }}
              </div>
            </div>
            <div class="relative w-full">
              <div
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Email
              </div>
              <div
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 h-[40px]"
              >
                {{ email || "-" }}
              </div>
            </div>
            <div class="relative w-full">
              <div
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Nomor Telepon
              </div>
              <div
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 h-[40px]"
              >
                {{ phone || "-" }}
              </div>
            </div>
            <div class="relative w-full">
              <div
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Mobile Phone
              </div>
              <div
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 h-[40px]"
              >
                {{ mobile_phone || "-" }}
              </div>
            </div>

            <div class="relative w-full">
              <div
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Tipe Company
              </div>
              <div
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 h-[40px]"
              >
                {{ tipeCompany }}
              </div>
            </div>
            <div class="relative w-full">
              <div
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Province
              </div>
              <div
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 h-[40px]"
              >
                {{ selectedProvince }}
              </div>
            </div>
            <div class="relative w-full">
              <div
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Kota
              </div>
              <div
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 h-[40px]"
              >
                {{ selectedCity }}
              </div>
            </div>
            <div class="relative w-full">
              <div
                class="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-700"
              >
                Alamat
              </div>
              <div
                class="w-full rounded-md px-2 py-2.5 md:text-sm text-xs border border-gray-300 h-[40px]"
              >
                {{ alamat || "-" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
