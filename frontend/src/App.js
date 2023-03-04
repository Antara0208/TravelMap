import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import "mapbox-gl/dist/mapbox-gl.css";
import Register from "./components/Register";
import Login from "./components/Login";
import "./App.css";
import { format } from "timeago.js";

function App() {
  const myStorage = localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });

  const handleMarkerclick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const getPins = async () => {
    try {
      let result = await fetch("http://localhost:8000/api/pins");
      result = await result.json();
      setPins(result);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddClick = (e) => {
    setNewPlace({
      lat: e.lngLat.lat,
      long: e.lngLat.lng,
    });

    console.log(e.lngLat.lat);
  };

  useEffect(() => {
    getPins();
    setCurrentUsername(null); 
  }, []);


  const handleLogout = ()=>{
    myStorage.removeItem("user");
    setCurrentUsername(null);
  }

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      let result = await fetch("http://localhost:8000/api/pins", {
        method: "POST",
        body: JSON.stringify(newPin),
        headers: {
          "content-type": "application/json",
        },
      });

      result = await result.json();
      setPins([...pins, result]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }

    console.log(title, desc, rating);
  };

  return (
    <Map
      initialViewState={{
        longitude: viewport.longitude,
        latitude: viewport.latitude,
        zoom: 4,
      }}
      mapboxAccessToken="Your mapbox access token"
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onDblClick={handleAddClick}
      transitionDuration="200"
    >
      {pins.map((p) => (
        <>
          <Marker
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-viewport.zoom * 3.5}
            offsetTop={-viewport.zoom * 7}
          >
            <RoomIcon
              style={{
                fontSize: viewport.zoom * 7,
                color: p.username === currentUsername ? "tomato" : "slateblue",
                cursor: "pointer",
              }}
              onClick={() => handleMarkerclick(p._id, p.lat, p.long)}
            />
          </Marker>

          {p._id === currentPlaceId && (
            <Popup
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              anchor="left"
            >
              <div className="card">
                <div>
                  <label>Place</label>
                  <p className="place">{p.title}</p>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="star1">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
                  <label>Information</label>
                  <div className="username">
                    Created By <b>{p.username}</b>
                  </div>
                  <div className="date">{format(p.createdAt)}</div>
                </div>
              </div>
            </Popup>
          )}
        </>
      ))}

      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor="left"
        >
          <div>
            <form onSubmit={HandleSubmit}>
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter the Title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea
                type="text"
                placeholder="Say us something about this place"
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">
                Add Pin
              </button>
            </form>
          </div>
        </Popup>
      )}

      {currentUsername ? (
        <button className="button logout" onClick={handleLogout}>LogOut</button>
      ) : (
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>
            LogIn
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      )}

      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUsername = {setCurrentUsername}/>}
    </Map>
  );
}

export default App;
