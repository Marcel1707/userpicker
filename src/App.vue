<script setup>
import Button from 'primevue/button';
import PickerWheel from './components/PickerWheel.vue'
import UserData from './components/UserData.vue'
import {ref} from "vue";

const users = ref([
  { name: "User 1" },
  { name: "User 2" },
  { name: "User 3" },
  { name: "User 4" },
  { name: "User 5" }
]);

const updateUsers = (newUsers) => {
  users.value = newUsers;
};

</script>

<template>
  <div class="container">
    <div class="left-section">
      <PickerWheel :users="users"></PickerWheel>
    </div>
    <div class="right-section">
      <UserData :users="users" @update-users="updateUsers"></UserData>
    </div>
  </div>
</template>


<style>
.container {
  display: flex;
  gap: 2rem;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.left-section {
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>

