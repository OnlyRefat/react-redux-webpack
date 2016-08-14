import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddForm from './containers/form/addform';
import SingleItem from './containers/form/single';
import request from 'superagent';

class Router extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
  this.props.FetchEmail(); 
  }
  render() {
    const showItem = (item, index) => {
      return (<SingleItem key={index} item = {item} ToggleEdit={this.props.ToggleEdit} DeleteItem={this.props.DeleteItem} EditItem={this.props.EditItem}/>);
    }
    return (<div>
      <AddForm add = {this.props.AddItem}/>
      <ul>
        {this.props.item.map(showItem)}
      </ul>
      <button onClick={this.handleClick}>Fetch Email From DB</button>
    </div>);
  }
}

function AddItem(data) {
  let convertedData = {};
  convertedData.data = data;
  convertedData.uid= new Date().getTime();
  convertedData.open = false;
  return ({
      type: 'AddItem',
      data: convertedData}
    );
}

function DeleteItem (id) {
    return ({
      type: 'DeleteItem',
      id: id
    });
}

function ToggleEdit (id) {
  return ({
    type: 'ToggleItem',
    id: id,
  })
}

function EditItem (id, value) {
  console.log(id);
  console.log(value);
  return ({
    type: 'EditItem',
    data: value,
    id: id,
  })
}


function successRequest(data) {
  return ({
    type: 'FetchEmail',
    emails: data,
  }); 
}

// For doing async request
function FetchEmail() {
  return (dispatch, getState) => {
    console.log(getState());
    request
    .get('http://localhost:5000/useremail')
    .end(function(err, res){
        // Do something 
      if (res.statusText === 'OK') {
        return dispatch(successRequest(JSON.parse(res.text)));
      }
    });  
  }
}

export default connect(state => ({
	item: state.todo.allItem,
}), { AddItem , DeleteItem, ToggleEdit, EditItem, FetchEmail })(Router);
