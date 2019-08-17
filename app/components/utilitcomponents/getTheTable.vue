<template>
<div>
    <div class="modal-text">Minimal {{min}} <strike>A</strike>, maximum {{max}} <strike>A</strike></div>
    <input class="modal-input" :class="'txt-' + className" type="number" @input="validate" v-model.number="deposit" :step="min">
</div>
</template>

<script>
import Store from '../../Store';
export default {
    props: ['value'],
        data() {
            return {
                deposit: this.min,
                className: 'red'
            }
        },
        mounted(){
              this.deposit = this.min;
        },
        computed: {
            min: () => Store.room.minDeposit,
            max: () => Store.room.maxDeposit
        },
        methods: {
        validate() {
            const {deposit, min, max} = this;
            this.className = 'green';
            if (deposit < min) {
                this.deposit = min;
                this.className = 'red';
            }
            else if(deposit > Store.user.balance){
                this.className = 'red';
                this.deposit = Store.user.balance;
            }
            else if(deposit > max){
                this.className = 'red';
                this.deposit = max;
            }
            this.$emit('input', this.deposit);
        }
    }
}
</script>
