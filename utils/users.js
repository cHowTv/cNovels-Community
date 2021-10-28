function userJoin(id, username, room){
    return {
        id,
        username,
        room
    }
}

function getCurrentUser(id){
    return id;
}

//removes user from room 
function userLeave(id){


}

function getRoomUsers(room){

}
module.exports ={
    userJoin,
    getCurrentUser, 
    userLeave,
    getRoomUsers
} 