import React, {Component} from "react";
import {Input} from "./GUIUtils";
import RemoteDB from "./RemoteDB"


export default class CommandBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            command:"",
            data:[],
        };

        this.db = new RemoteDB("commandbar");
        this.db.connect();

        this.query = this.db.makeLiveQuery({type:'app'});

        this.query.on('update', (data) =>  {
            this.setState({data: data})
        });
        this.query.on('execute', (data) => {
            this.setState({data: data})
        });

        this.query.execute();

        this.keydown = (e) => { if(e.keyCode === 13) this.runCommand(this.state.command); };
        this.edited = (e) => {
            const txt = e.target.value;
            this.setState({command:txt});
            this.query.updateQuery({type:'app', name: { $regex:txt, $options:'i'}});
        }

    }
    runCommand(app) {
        this.db.sendMessage({
            type:'command',
            target: 'system',
            command: "launch",
            app: app,
        });
        this.setState({command:""})
    }
    render() {
        return <div className="command-bar">
            <Input type="text" value={this.state.command} onKeyDown={this.keydown} onChange={this.edited} db={this.db}/>
            {this.renderDropdown()}
        </div>
    }

    renderDropdown() {
        if(this.state.command.length < 2) return <ul className="dropdown"></ul>;
        return <ul className="dropdown">
            {this.state.data.map((app,i) => {
                return <li key={i} onClick={()=>this.runCommand(app.name)}>{app.title}</li>
            })}
        </ul>
    }
}
