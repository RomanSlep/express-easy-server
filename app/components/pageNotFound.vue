<template>
    <div>
        <h1 class="txt-red">Error 404!</h1>
        <h1 class="txt-red">Page not found!</h1>
        <span class="but txt-blue" @click="Store.rout('mainPage')">Main page</span>
    </div>
</template>

<script>
import Store from '../Store';
export default {
    data() {
        return {Store}
    }
}
</script>