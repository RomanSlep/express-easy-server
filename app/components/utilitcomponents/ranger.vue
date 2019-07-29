<template>
    <div class="ranger">
        <div class="ranger_button but hovered">+</div>
        <input class="ranger-input" v-model="value">
        <div class="ranger_button but hovered">-</div>
    </div>
</template>

<script>
import Store from '../Store';
export default {
    props: ['min', 'max', 'step', 'value'],

}
</script>
