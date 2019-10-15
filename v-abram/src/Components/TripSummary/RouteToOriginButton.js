import React, { Component } from 'react';
//make a container that gives this thing special props
class RouteToOriginButton extends Component {
    state= {
        checked: false
    }

    handleChange=(e)=>{
        this.props.toggleOriginToRouteMode()
        // console.log(e)
        // this.setState({
        //     ...this.state,
        //     checked: !(this.state.checked)
        // })
    }

    displayValue = () =>{
        if(this.state.checked===true){
            if(this.props.route_to_origin.status === ""){
                return "(select a destination first...)"
            } else if (this.props.route_to_origin.status === "loading"){
                    return (
                    <div class="spinner-border" role="status">
                        <div class="sr-only">Loading...</div>
                    </div>
                )
            } else if (this.props.route_to_origin.status === 'success'){
                return (<>
                <div id="routeToOriginOK" class="badge badge-success">OK</div>
                {/* {console.log(this.props.route_to_origin.data.price)} */}
                </>)
            } else if (this.props.route_to_origin.status === 'failure'){
                return <div title="Failed to route">
                    :(
                </div>
            }
    }
}

render(){
    return(
    <div id="routeToOrigin" title="Calculate cost to return to the origin from the last destination">
        {/* <InputGroup onClick={()=>this.props.toggleOriginToRouteMode()}>
            <InputGroupAddon addonType="prepend">
                <InputGroupText>
                    <Input checked={this.props.route_to_origin.mode} addon type="checkbox" aria-label="Checkbox for returning to origin" />
                </InputGroupText>
            </InputGroupAddon>
        <InputGroupAddon addonType="append">
        <InputGroupText>Return to Origin {this.displayValue()}</InputGroupText>
        </InputGroupAddon>
        </InputGroup> */}
    </div>)
}

}



export default RouteToOriginButton