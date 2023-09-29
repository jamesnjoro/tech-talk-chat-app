const { ref } = Vue
const socket = io();

export default {
  setup() {
    //state
    const messages = ref([])
    const users = ref([])
    const textInput = ref('');
    const userName = ref('')

    //get user name
    userName.value = prompt("Please enter your name");



    //socket.io operations
    socket.emit('identify', userName.value);

    socket.on('identify', (usersList) => {
      users.value = usersList
    });

    socket.on('chat message', (msg) => {
      if(msg.user != userName.value){
        updateMessages(msg.text, 'incoming',msg.user)
      }
    });


    //messages operations
    function updateMessages(text, type, aUser){
      messages.value.push({
        type,
        text,
        user: aUser,
      })
    }

    function saveMessage(){
      updateMessages(textInput.value,'outgoing',userName.value)
      let newMessage  = {
        user:userName.value,
        text:textInput.value
      }
      socket.emit('chat message', newMessage);
      textInput.value = ''
    }

    function isActive(cUser){
      return cUser == userName.value?'active-user':''
    }

    return { messages, users, saveMessage, textInput, userName, isActive }
  },
  template: 
    `<div class="chat-app">
    <div class="chat-header">
        <h1>Tech Talk Chat App</h1>
    </div>
    <div class="chat-container">
        <div class="chat-sidebar">
            <!-- Add contacts or user list here -->
            <ul class="contact-list">
                <li v-for="user in users" class="contact" :class="isActive(user)">{{user}}</li>
                <!-- Add more contacts as needed -->
            </ul>
        </div>
        <div class="chat-main">
            <div class="chat-messages">
                <!-- Display chat messages here -->
                <div v-for="message in messages" class="message" :class="message.type">
                    <div class="message-text">
                    {{message.text}} <br/>
                    <span class='user-name'>{{message.user}}</span>
                    </div>
                </div>
                <!-- Add more messages as the conversation continues -->
            </div>
            <div class="chat-input">
                <input v-model="textInput" v-on:keyup.enter="saveMessage"  type="text" placeholder="Type your message...">
                <button @click="saveMessage" class="send-button">Send</button>
            </div>
        </div>
    </div>
  </div>`
}