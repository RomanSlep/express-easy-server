<template>
    <div id="table">
        <div v-for="n in [1, 2, 3, 4, 5, 6]" :key ="n" :id="'player' + n" class ="player-place">{{n}}</div>
        <div id="common-cards">
            <div v-for="n in [1, 2, 3, 4, 5]" :key ="n" :id="'card' + n" class="card-place">{{n}}</div>
        </div>
    </div>
</template>

<script>
import Store from '../Store';
export default {
    data() {
        return {
            
        }
    },
    mounted() {
       setPositions();
    },
    methods: {

    }
}

function setPositions(){
      const table = document.getElementById('table');
        const width = table.offsetWidth;
        const height = table.offsetHeight;

        const widthPlayer = document.getElementById('player3').offsetWidth;
        const heightPlayer = document.getElementById('player3').offsetHeight;
      
        const leftPos = 0;
        const topPos = height - heightPlayer * 0.5;
        const rightPos = width - widthPlayer;
        const bottomPos = -heightPlayer * 0.5;

        const player1 = document.getElementById('player1');
        const player2 = document.getElementById('player2');
        const player3 = document.getElementById('player3');
        const player4 = document.getElementById('player4');
        const player5 = document.getElementById('player5');
        const player6 = document.getElementById('player6');

        player6.style.marginLeft = leftPos + 'px';
        player6.style.marginTop = bottomPos + 'px';

        player2.style.marginLeft = rightPos + 'px';
        player2.style.marginTop = bottomPos + 'px';

        player1.style.marginLeft = rightPos / 2 + 'px';
        player1.style.marginTop = bottomPos - 0.5 * heightPlayer + 'px';
       
        player4.style.marginLeft = rightPos / 2 + 'px';
        player4.style.marginTop = topPos + 0.5 * heightPlayer + 'px';
       
        player5.style.marginLeft = leftPos + 'px';
        player5.style.marginTop = topPos + 'px';

        player3.style.marginLeft = rightPos + 'px';
        player3.style.marginTop = topPos + 'px';

        // Места для карт

}
</script>
