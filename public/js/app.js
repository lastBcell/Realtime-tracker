const socket = io();

// console.log("hey")
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
        const{latitude,longitude } = position.coords;
        console.log(latitude,longitude)
        socket.emit("send-Location",{latitude,longitude});
    },
    (error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy:true,
        timeout:3000,
        maximumAge:0
    },
)
}

const map = L.map("map").setView([24,78],5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Live Tracking"
}).addTo(map)

const markers ={}

socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data;
    console.log(id,latitude,longitude);
    map.setView([latitude,longitude],10);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnected",(id)=>{
    console.log("user-dissconnected")
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})