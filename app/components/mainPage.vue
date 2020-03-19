<template>
   <h1>Game {{Store.user.login}} <span class="txt-red" @click="Store.defaultUser()">Exit</span></h1>
</template>

<script>
import Store from '../Store';
export default {
    data() {
        return {Store}
    }
}
</script>
