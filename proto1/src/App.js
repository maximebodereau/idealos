import React, {Component} from 'react';
import './App.css';
import FakeWindow from "./FakeWindow";
import "font-awesome/css/font-awesome.css";
import Alarms from "./Alarms";
import {VBox} from "./GUIUtils";
import Launcher from "./Launcher";
import MusicPlayer from "./MusicPlayer";
import Contacts from "./Contacts";
import Todos from "./Todo";

import RemoteDB from "./RemoteDB";


const APP_REGISTRY = {
    'alarms': {
        title: 'Alarm',
        app: Alarms,
    },
    'musicplayer': {
        title: 'Music Player',
        app: MusicPlayer,
    },
    'contacts': {
        title: 'Contacts',
        app: Contacts,
    },
    'todolist': {
        title: 'Todo List',
        app: Todos,
    },
};

class App extends Component {
    constructor(props) {
        super(props);
        this.DB = new RemoteDB(this);
        this.state = {
            apps: []
        };
        this.DB.on('connect', (m) => {
            console.log("fully connected", m);
            this.setState({apps: [{title: 'Alarms 1', app: <Alarms db={this.DB}/>}]});
        });
        this.DB.on("receive", (m) => {
            console.log("got a message back", m);
        });
        this.DB.connect();
    }


    launch(msg) {
        console.log("launching an app");
        var apps = this.state.apps.slice();
        var info = APP_REGISTRY[msg.app];
        var AppComponent = info.app;
        apps.push({title: info.title, app: <AppComponent db={this.DB}/>});
        this.setState({apps: apps});
    }

    render() {
        return (
            <VBox>
                {this.state.apps.map((a, i) => <FakeWindow title={a.title} key={i}>{a.app}</FakeWindow>)}
                <Launcher db={this.DB}/>
            </VBox>
        );
    }

}

export default App;
