//set firebase db 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsements-app-6e4e6-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementDB = ref(database, "endorsement")

//link html elements
const endorsement_input_field = document.getElementById("endorsement-input-field"); 
const publish_button = document.getElementById("publish-button");
const endorsement_message = document.getElementById("endorsement-message");


publish_button.addEventListener("click", function() {
    let endorsement_input_value = endorsement_input_field.value;
    
    push(endorsementDB, endorsement_input_value);
    
    clear_input_field();
});

onValue(endorsementDB, function(snapshot){
    if(snapshot.exists()) {
        let items_array = Object.entries(snapshot.val())
        
        clear_endorsement_message()
        
        for(let i = 0; i < items_array.length; i++) {
            let current_item = items_array[i]
            let current_item_id = current_item[0]
            let current_item_value = current_item[1]
            
            append_item_to_comment_section(current_item)
        }
    } else {
        endorsement_message.innerHTML = `<p id="endorsement-section-placeholder">No endorsement comment added...yet<p>`
    }
} )

function clear_endorsement_message() {
    endorsement_message.innerHTML = ""
}

function clear_input_field() {
    endorsement_input_field.value = ""
}

function append_item_to_comment_section(comment) {
    let comment_id = comment[0]
    let comment_value = comment[1]
    
    let new_comment = document.createElement("li")
    new_comment.textContent = comment_value
    
    new_comment.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `endorsement/${comment_id}`)
        
        remove(exactLocationOfItemInDB)
    })
    endorsement_message.append(new_comment)
}
