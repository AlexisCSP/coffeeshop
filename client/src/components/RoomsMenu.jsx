import React from 'react';
import {NavLink} from 'react-router-dom';

function RoomsMenu(props) {
    if (props.rooms.length > 0){
        return <div class="room-menu">
            <h2>Available Rooms</h2>
            <ul>
                {
                    props.rooms.map( room =>
                      <li 
                        class="sidebar-button room-option"
                        key={room.id}
                      >
                        <NavLink 
                          to={"/rooms/" + room.id}  
                          activeClassName="selected"
                        >
                          {room.title}
                        </NavLink>
                      </li>
                    )
                }
            </ul>
        </div>
    }
    return <div class="room-menu empty"></div>;
}

export default RoomsMenu;