<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { d$auth } from "@/stores/auth";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = d$auth();
const { GetDataProfile } = storeToRefs(authStore);
const DataProfile = ref([]);
onMounted(async () => {
  if (GetDataProfile.value.length === 0) {
    await GetProfile();
  }
  DataProfile.value = GetDataProfile.value;
});

const logout = async () => {
  try {
    await authStore.Api$Logout();
    router.replace({ name: "login" });
  } catch (err) {
    console.error(err);
    errorMessage.value = err || "Logout gagal";
  }
};
const GetProfile = async () => {
  try {
    await authStore.Api$Profile();
  } catch (err) {
    console.error(err);
    errorMessage.value = err || "Logout gagal";
  }
};
</script>

<template>
  <nav class="fixed top-0 z-50 w-full border-b bg-gray-800 border-gray-700">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
          <button
            data-drawer-target="logo-sidebar"
            data-drawer-toggle="logo-sidebar"
            aria-controls="logo-sidebar"
            type="button"
            class="inline-flex items-center p-2 text-sm rounded-lg sm:hidden focus:outline-none focus:ring-2 text-white hover:bg-gray-700 focus:ring-gray-600"
          >
            <span class="sr-only">Open sidebar</span>
            <svg
              class="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>
          <a class="flex ms-4 md:me-24">
            <img src="/favicon.ico" class="h-8 me-3" alt="Logo" />
            <span
              class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white"
              >Test Skill</span
            >
          </a>
        </div>
        <div class="flex items-center">
          <div class="flex items-center ms-3">
            <div>
              <button
                type="button"
                class="cursor-pointer flex text-sm bg-gray-300 rounded-full focus:ring-4 focus:ring-gray-300"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="w-8 h-8 rounded-full"
                  :src="DataProfile.profileImage"
                  :alt="`user-${DataProfile.name}`"
                />
              </button>
            </div>
            <div
              class="z-50 hidden my-4 text-base list-none divide-y rounded-sm shadow-sm bg-gray-700 divide-gray-600"
              id="dropdown-user"
            >
              <div class="px-4 py-3 space-y-2" role="none">
                <p class="text-sm text-white" role="none">
                  {{ DataProfile.name }}
                </p>
                <p class="text-sm font-medium text-white truncate" role="none">
                  {{ DataProfile.email }}
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <router-link
                    to="/dashboard"
                    active-class=""
                    exact-active-class=""
                    class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white"
                    role="menuitem"
                  >
                    Dashboard
                  </router-link>

                  <router-link
                    to="/dashboard/profile"
                    active-class=""
                    exact-active-class=""
                    class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white"
                    role="menuitem"
                  >
                    Profile
                  </router-link>
                </li>
                <li>
                  <button
                    type="button"
                    @click="logout"
                    class="w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <aside
    id="logo-sidebar"
    class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white">
      <ul class="space-y-2 font-medium">
        <router-link
          data-drawer-hide="logo-sidebar"
          to="/dashboard"
          class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
          exact-active-class="bg-gray-200 text-blue-600 font-semibold"
        >
          Dashboard
        </router-link>
        <router-link
          data-drawer-hide="logo-sidebar"
          to="/dashboard/profile"
          class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
          exact-active-class="bg-gray-200 text-blue-600 font-semibold"
        >
          Profile
        </router-link>
        <router-link
          data-drawer-hide="logo-sidebar"
          to="/dashboard/customer"
          class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
          exact-active-class="bg-gray-200 text-blue-600 font-semibold"
        >
          Customer
        </router-link>
        <router-link
          data-drawer-hide="logo-sidebar"
          to="/dashboard/transaction"
          class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
          exact-active-class="bg-gray-200 text-blue-600 font-semibold"
        >
          Transaction
        </router-link>
        <button
          data-drawer-hide="logo-sidebar"
          @click="logout"
          class="cursor-pointer w-full flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
          exact-active-class="bg-gray-200 text-blue-600 font-semibold"
        >
          Logout
        </button>
      </ul>
    </div>
  </aside>
</template>
