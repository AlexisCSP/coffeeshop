
async function getCandidates(roomId) {
    const result = await $.ajax({
     url: "http://localhost:3001/rooms/" + roomId + "/candidates",
     type: "GET"
    });
    return result;
}