<template name="login">
    <div>
        <div class="form">
            <h3>{{action}}</h3>
            <input v-model="user.login" placeholder="Login">
            <input v-model="user.address" placeholder="Address" v-show="action === 'Registration'">
            <input v-model="user.password" placeholder="Password" type="password">
            <div @click="go" class="but">{{action}}</div>
            <i @click="action = antoAction"><u>U got {{antoAction}}?</u></i>
        </div>
    </div>
</template>

<script>
import Store from '../Store';
export default {
    data() {
        return {
            action: 'Login',
            user: Store.user
        }
    },
    methods: {
            go() {
                console.log(this.user, this.action);
            }
        },
        computed: {
            antoAction() {
                return this.action === 'Registration' ? 'Login' : 'Registration'
            }
        }
    }
</script>
