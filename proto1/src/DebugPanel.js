import React, {Component} from "react";
import {VBox, HBox} from "appy-comps";
import {Input, Scroll} from "./GUIUtils";
import RemoteDB from "./RemoteDB"

export default class DebugPanel extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("debug");
        this.db.connect();

        this.enterFullscreen = () => {
            props.db.sendMessage({
                type: 'command',
                target: 'system',
                command: 'enter-fullscreen'
            })
        };

        this.state = {
            query: '{"type":"contact"}',
            valid: true,
            results: [],
        };

        this.editedQuery = (e) => {
            this.setState({query: e.target.value});
        };

        this.submitQuery = () => {
            console.log("verifying", this.state.query);
            try {
                const query = JSON.parse(this.state.query);
                this.setState({valid: true});
                this.db.query(query).then((docs) => {
                    this.setState({results: docs})
                })
            } catch (e) {
                this.setState({valid: false});
            }
        }
    }

    render() {
        return <VBox grow>
            <h3>Debug</h3>
            <HBox>
                <button disabled onClick={this.enterFullscreen}>full screen</button>
            </HBox>
            <label>query tester</label>
            <HBox style={{border: '1px solid ' + (this.state.valid ? 'green' : 'red')}}>
                    <Input onChange={this.editedQuery} db={this.db} value={this.state.query} style={{flex:1}}/>
                    <button onClick={this.submitQuery}>run</button>
            </HBox>
            <Scroll>{this.renderResultsTable(this.state.results)}</Scroll>
        </VBox>
    }

    renderResultsTable(docs) {
        if(docs.length <= 0) {
            return <div>no results</div>
        }

        const first = docs[0];
        const keys = Object.keys(first);
        const header = <tr>{keys.map((key)=><td key={key}>{key}</td>)}</tr>;
        const body = docs.map((doc,i)=>{
            return <tr key={i}>{keys.map((key)=>this.renderValue(doc,key))}</tr>;
        });
        return <table>
                <thead>{header}</thead>
                <tbody>{body}</tbody>
        </table>
    }
    renderValue(doc,key) {
        if(!doc[key]) return <td key={key}>--</td>;
        return <td key={key}>{doc[key].toString()}</td>
    }
}