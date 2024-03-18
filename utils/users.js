const users = [];

function userJoin(id,username,room){
    const user = {id,username,room};

    users.push(user);

    return user;

}

// Single user retrieval
function getCurrentUser(id){
    return users.find(user => user.id == id);
}

// user leave the room 

function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index!=-1){
        return users.splice(index,1)[0];
    }
}

// Get room users

function getRoomUsers(room){
    return users.filter(user=> user.room === room);
}

module.exports = {
    getCurrentUser,
    userJoin,
    userLeave,
    getRoomUsers
};