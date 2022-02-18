import React from 'react'

class Trial extends React.Component{
    render(){
        return(
            <div className={`alert alert-${this.props.bgColor}`}>
                <h2 className={`text-${this.props.textColor}`}>{this.props.title}</h2>
                <h5>{this.props.subtitle}</h5>
            </div>
        )
    }
}

export default Trial;