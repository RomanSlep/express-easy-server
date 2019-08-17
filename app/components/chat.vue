<template>
    <div id="chat">
        <div id="messages">
            <div v-for="(m, i) in messages" class="msg" :class="'msg-' + (m.login === user.login ? 'out' : 'in')" :key="i">
                <div class="msg-txt"><u>{{m.login}}</u>> {{m.msg}}</div>
            </div>
        </div>
        <div id="chat-input">
            <textarea class="autosize" rows="2" v-model="msg"></textarea>
            <i @click="send" class="fa fa-paper-plane txt-blue hovered" aria-hidden="true"></i>
        </div>
    </div>
</template>

<script>
import Store from '../Store';
export default {
    data() {
        return {
            msg: ''
        }
    },
    mounted() {
        // autosize();
    },
    computed: {
        messages: () => JSON.parse(JSON.stringify(Store.chat)).reverse(),
        user: ()=> Store.user
    },
    methods: {
        send() {
            Store.emit('chatMsg', {msg: this.msg.trim()});
            this.msg = '';
        }
    }
}

function autosize(){
    const text = document.querySelector('.autosize');
    text.each(function(){
        $(this).attr('rows',1);
        resize($(this));
    });

    text.on('input', function(){
        resize($(this));
    });
    
    function resize ($text) {
        $text.css('height', 'auto');
        $text.css('height', $text[0].scrollHeight+'px');
    }
}
</script>
