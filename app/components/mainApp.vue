<template>
    <component v-bind:is="currentComponent"></component>
</template>

<script>
    import Store from '../Store';
    import mainPage from './mainPage.vue';
    import pageNotFound from './pageNotFound.vue';

    const components = {
        mainPage,
        pageNotFound
    };

    export default {
        components,
        data() {
            return {
                Store
            }
        },
        computed: {
            currentComponent() {
                const {router} = Store;
                if(!components[router]){
                    return 'pageNotFound';
                }
                return router;
            }
        }
    }
</script>