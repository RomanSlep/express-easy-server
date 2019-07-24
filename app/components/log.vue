<template>
<div id="log">
    <div class="log-line" v-for="(l, i) in log" :key="i" :class="'txt-' + (l.type || 'green')">{{l.msg}}</div>
</div>
</template>

<script>
import Store from '../Store';
export default {
    computed: {
        log() {
            return JSON.parse(JSON.stringify(Store.log)).reverse();
        }
    }
}
</script>
