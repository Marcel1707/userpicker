<template>
  <h2>Users</h2>

  <Toast/>

  <div class="p-field p-grid usernameContainer">
    <InputText class="usernameInput" v-model="newUserName" placeholder="Enter a username"/>
    <Button label="Add User" icon="pi pi-plus" @click="addUser" class="addUsernameButton" style="flex: none;"/>
  </div>

  <DataTable :value="users" v-model:editingRows="editingRows" v-model:selection="selectedUsers"
             @update:selection="onSelectionChange" editMode="row" @row-edit-save="onRowEditSave"
             class="user-table">

    <Column selectionMode="multiple"></Column>

    <Column field="name" header="Username" style="width: 90%">
      <template #editor="{ data, field }">
        <InputText v-model="data[field]"/>
      </template>
    </Column>

    <Column frozen
            align-frozen="right"
            style="min-width: 8rem"
            bodyStyle="text-align:center"
    >
      <template #body="{ editorInitCallback, index }">
        <Button
            icon="pi pi-pencil"
            severity="secondary"
            class="p-link"
            text
            rounded
            @click="editorInitCallback"
        />
        <Button
            icon="pi pi-trash"
            severity="secondary"
            text
            rounded
            @click="deleteUser(index)"
        />
      </template>

      <template #editor="{ editorSaveCallback, editorCancelCallback, index }">
        <Button
            icon="pi pi-check"
            severity="secondary"
            text
            rounded
            @click="editorSaveCallback"
        />
        <Button
            icon="pi pi-times"
            severity="secondary"
            text
            rounded
            @click="editorCancelCallback"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script>
import {defineComponent, ref, watch} from 'vue';
import {useToast} from "primevue/usetoast";
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toast from "primevue/toast";

export default defineComponent({
  components: {
    DataTable,
    Column,
    InputText,
    Button,
    Checkbox,
    Toast
  },
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  emits: ['update-users'],
  setup(props, {emit}) {
    const username = ref('');
    const editingRows = ref([]);
    const selectedUsers = ref();
    const toast = useToast();

    watch(
        () => props.users,
        (newUsers) => {
          if (newUsers) {
            selectedUsers.value = newUsers.filter(user => user.enabled === true);
          }
        },
        {immediate: true}
    );

    const addUser = () => {
      if (username.value) {
        if (props.users.map(user => user.name).includes(username.value)) {
          toast.add({severity: 'error', summary: 'Error', detail: 'The username must be unique!', life: 3000});
        } else {
          const newUser = {name: username.value, enabled: true};
          const updatedUsers = [...props.users, newUser];
          emit('update-users', updatedUsers);
          username.value = '';
        }
      }
    };

    const updateUser = (event) => {
      const {newData, index} = event;

      if (props.users.some((user, i) => user.name === newData.name && i !== index)) {
        toast.add({severity: 'error', summary: 'Error', detail: 'The username must be unique!', life: 3000});
      } else {
        const updatedUsers = props.users.map((user, i) => {
          return i === index ? {...user, name: newData.name} : user;
        });
        emit('update-users', updatedUsers);
      }
    };

    const deleteUser = (index) => {
      const updatedUsers = props.users.filter((_, i) => i !== index);
      emit('update-users', updatedUsers);
    };

    const onSelectionChange = (event) => {
      const enabledUsernames = new Set(event.map(user => user.name));
      if (props.users) {
        const updatedUsers = props.users.map(user => ({
          ...user,
          enabled: enabledUsernames.has(user.name)
        }));
        emit('update-users', updatedUsers);
      }
    };

    return {
      newUserName: username,
      editingRows,
      addUser,
      onRowEditSave: updateUser,
      deleteUser,
      selectedUsers,
      onSelectionChange
    };
  },
});
</script>

<style>

.user-table {
  margin-top: 1rem;
  width: 100%;
}

.usernameContainer {
  box-sizing: border-box;
  display: flex;
  gap: 8px;
  width: 100%;
}

.usernameInput {
  flex: 1;
  margin-right: 8px;
}

.addUsernameButton {
  flex-shrink: 0;
}

</style>
