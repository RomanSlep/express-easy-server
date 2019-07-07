<template>
      <div id="rating">
            <h2>Rating players!</h2>
            <table>
                <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>Rating</th>
                </tr>
                <tr v-for="(u, i) in totalRatings" :class="'rating-' + i" :key="u.login">
                    <td>{{i+1}}.</td>
                    <td>{{u.login}}</td>
                    <td>{{+(u.score).toFixed(0) | numFormat}}</td>
                </tr>
            </table>
        </div>
</template>
<script>
import Store from '../Store';
export default {
    computed: {
        totalRatings() {
            return Store.totalRatings;
        }
    }
}
</script>
