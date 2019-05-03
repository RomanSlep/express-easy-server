import Vue from 'vue/dist/vue.js';
import Store from '../Store';

export default Vue.component('topBar', {
    template: /*html*/ `
 <div id="topbar">
       <div class="deposit-block">
           <input type="number" v-model="Store.deposit">
           <div class="but bg-grey w100 hovered">Add deposit</div>
       </div>
     
       <div class= "buttons-rate">
            <div v-for="r in buttonsRate" @click="changeRate(r)" 
            class="but hovered"
            :class="{'bg-red':r<0, 'bg-green': r>0}"
            >
                {{r > 0 ? '+' : ''}}{{r}}%
            </div>
       </div>

       <div class="bet_count">
        <input type="number" v-model="Store.bet">
        <div class="buttons-count">
        <div v-for="c in buttonsCountBombs"
         @click="changeCountBombs(c)" 
        :class="{activeCount: Store.activeCount === c}"
         class="but hovered bg-blue m1"
            >
                {{c}}
        </div>
        </div>
    </div>
</div>
   `,
    data() {
        return {
            Store,
            buttonsRate: [10, 50, 100, -100, -50, -10],
            buttonsCountBombs: [1, 3, 5, 10, 25]
        };
    }
});