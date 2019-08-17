<template>
<div id="modal" class="bg" :class="{'show-modal': isShow}">
    <div id="modal-content">
        <div id="modal-header" class="bg-blue bg">
            <span class="title">{{header}}</span>
            <i class="fa fa-times-circle-o hovered" aria-hidden="true" @click="hide"></i>
        </div>
        <div id="modal-body">
            <get-the-table v-model="param1" v-if="componentName === 'getTheTable'"></get-the-table>
        </div>
        <div id="modal-but">
            <div class="but bg-red hovered bg" @click="hide">Cancel</div>
            <div class="but hovered bg bg-green" v-show="cb" @click="success">Ok</div>
        </div>
    </div>
</div>
</template>

<script>
import Store from '../Store';
import getTheTable from './utilitcomponents/getTheTable.vue';

export default {
    components:{
        getTheTable
    },
    data() {
        return {
            isShow: false,
            componentName: null,
            body: 'Body',
            header: 'Header',
            cb: null,
            param1: undefined,
            param2: undefined
        }
    },
    created() {
        Store.modal = this;
    },
    methods: {
        /**
         * @argument {body, header, cb}
         */
        show(params, componentName) {
            this.isShow = true;
            Object.assign(this, params);
            this.componentName = componentName;
        },
        hide() {
            this.isShow = false;
            this.cb = null;
            this.componentName = null;

        },
        success() {
            this.cb && this.cb();
            this.hide();
        }
    }
}
</script>
