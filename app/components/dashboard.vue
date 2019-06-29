<template name="dashboard">
    <div>
        <h3>Hello, {{user.login}}!</h3>
        <div class="but" @click="exit">Exit</div>
    </div>
</template>

<script>
import Store from '../Store';
export default {
    data() {
            return {
                user: Store.user
            }
        },
        methods: {
            exit() {
                Store.user.isLogged = false;
                Store.user.token = false;
            }
        }
    }
</script>
