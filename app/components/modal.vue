<template>
<el-dialog
  :title="header"
  :visible.sync="isShow"
  width="300px"
  :before-close="cb">
  <span>This is a message</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isShow = false">Cancel</el-button>
    <el-button type="primary" @click="isShow = false">Confirm</el-button>
  </span>
</el-dialog>
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
