import React from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import TicketDetail from "./TicketDetail"
import EditTicketForm from "./EditTicketForm"
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import * as a from './../actions';
import { formatDistanceToNow } from 'date-fns';

class TicketControl extends React.Component {

    constructor(props) {
      super(props);
      
      this.state = {
        selectedTicket: null,
        editing: false
      };
    }

    componentDidMount() {
      this.waitTimeUpdateTimer = setInterval(() =>
        this.updateTicketElapsedWaitTime(),
      6000
      );
    }

    componentWillUnmount(){
      console.log("component unmounted!");
      clearInterval(this.waitTimeUpdateTimer);
    }

    updateTicketElapsedWaitTime = () => {
      const { dispatch } = this.props;
      Object.values(this.props.mainTicketList).forEach(ticket => {
          const newFormattedWaitTime = formatDistanceToNow(ticket.timeOpen, {
            addSuffix: true
          });
        const action = a.updateTime(ticket.id, newFormattedWaitTime);
        dispatch(action);
      });
    }

    handleClick = () => {
      if (this.state.selectedTicket != null) {
        this.setState({
          selectedTicket: null,
          editing: false
        });
      } else {
        const { dispatch } = this.props;
        const action = a.toggleForm();
        dispatch(action);
      }
    }
  
    handleAddingNewTicketToList = (newTicket) => {
      const { dispatch } = this.props;
      const action = a.addTicket(newTicket);
      dispatch(action);
      const action2 = a.toggleForm();
      dispatch(action2);
    }

    handleChangingSelectedTicket = (id) => {
      const selectedTicket = this.props.mainTicketList[id];
      this.setState({selectedTicket: selectedTicket});
    }

    handleDeletingTicket = (id) => {
      const { dispatch } = this.props;
      const action = a.deleteTicket(id);
      dispatch(action);
      this.setState({selectedTicket: null});
    }

    handleEditClick = () => {
      console.log("handleEditClick reached!");
      this.setState({editing: true});
    }

    handleEditingTicketInList = (ticketToEdit) => {
      const { dispatch } = this.props;
      const action = a.addTicket(ticketToEdit);
      dispatch(action);
      this.setState({
        editing: false,
        selectedTicket: null
      });
    }

    render(){
      let currentlyVisibleState = null;
      let buttonText = null; 
  
      if (this.state.editing ) {      
        currentlyVisibleState = <EditTicketForm ticket = {this.state.selectedTicket} onEditTicket = {this.handleEditingTicketInList} />
        buttonText = "Return to Ticket List";
      }
      else if (this.state.selectedTicket != null) {
        currentlyVisibleState = <TicketDetail ticket = {this.state.selectedTicket} onClickingDelete = {this.handleDeletingTicket}
        onClickingEdit = {this.handleEditClick}/>
        buttonText = "Return to Ticket List";
      }
      else if (this.props.formVisibleOnPage) {
        // This conditional needs to be updated to "else if."
        currentlyVisibleState = <NewTicketForm onNewTicketCreation={this.handleAddingNewTicketToList}  />;
        buttonText = "Return to Ticket List";
      } else {
        currentlyVisibleState = <TicketList ticketList={this.props.mainTicketList} onTicketSelection={this.handleChangingSelectedTicket} />;
        // Because a user will actually be clicking on the ticket in the Ticket component, we will need to pass our new handleChangingSelectedTicket method as a prop.
        buttonText = "Add Ticket";
      }
      return (
        <React.Fragment>
          {currentlyVisibleState}
          <button onClick={this.handleClick}>{buttonText}</button>
        </React.Fragment>
      );
    }
}

TicketControl.propTypes = {
  mainTicketList: PropTypes.object,
  formVisibleOnPage: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    mainTicketList: state.mainTicketList,
    formVisibleOnPage: state.formVisibleOnPage
  }
}

TicketControl = connect(mapStateToProps)(TicketControl);

export default TicketControl;