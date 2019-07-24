<template>
<div id="user-panel">
    <div id="modal-content">

    </div>
</div>
</template>

<script>
import Store from '../Store';
export default {
    data() {
        return {
            isShow: false,
            body: 'Body',
            header: 'Header',
            cb: null
        }
    },
    created() {
        Store.modal = this;
        console.log('Store', Store)
    },
    methods: {
        show(params) {
            this.isShow = true;
            Object.assign(this, params);
        },
        hide() {
            this.isShow = false;
            this.cb = null;
        },
        success() {
            this.cb && this.cb();
            this.hide();
        }
    }
}
</script>
