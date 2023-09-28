const { ref } = Vue
const socket = io();

export default {
  setup() {
    //state
    const messages = ref([])
    const users = ref([])
    const textInput = ref('');

    //get user name
    let userName = prompt("Please enter your name");



    //socket.io operations
    socket.emit('identify', userName);

    socket.on('identify', (usersList) => {
      users.value = usersList
    });

    socket.on('chat message', (msg) => {
      if(msg.user != userName){
        updateMessages(msg.text, 'incoming')
      }
    });


    //messages operations
    function updateMessages(text, type){
      messages.value.push({
        type,
        text
      })
    }

    function saveMessage(){
      updateMessages(textInput.value,'outgoing')
      let newMessage  = {
        user:userName,
        text:textInput.value
      }
      socket.emit('chat message', newMessage);
      textInput.value = ''
    }

    return { messages, users, saveMessage, textInput }
  },
  template: 
    `<div class="chat-app">
    <div class="chat-header">
        <h1>Chat App</h1>
    </div>
    <div class="chat-container">
        <div class="chat-sidebar">
            <!-- Add contacts or user list here -->
            <ul class="contact-list">
                <li v-for="user in users" class="contact">{{user}}</li>
                <!-- Add more contacts as needed -->
            </ul>
        </div>
        <div class="chat-main">
            <div class="chat-messages">
                <!-- Display chat messages here -->
                <div v-for="message in messages" class="message" :class="message.type">
                    <div class="message-text">{{message.text}}</div>
                </div>
                <!-- Add more messages as the conversation continues -->
            </div>
            <div class="chat-input">
                <input v-model="textInput" type="text" placeholder="Type your message...">
                <button @click="saveMessage" class="send-button">Send</button>
            </div>
        </div>
    </div>
  </div>`
}