<template name="dashboard">
    <div>
        <h3>Hello, {{user.login}}!</h3>
    </div>
</template>

<script>
import Store from '../Store';
export default {
    data() {
        return {
            user: Store.user
        }
    }
}
</script>
