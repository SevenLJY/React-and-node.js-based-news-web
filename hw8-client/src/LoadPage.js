import React from "react";
import Spinner from "react-bootstrap/Spinner";

class LoadPage extends React.Component {
    render () {
        return <div style={{
            position: 'relative',
            minHeight: '100vh',
            width: '100%',
            boxSizing: 'border-box',
        }}>
            <div style={{
                position: 'absolute',
                top: 'calc(50% - 50px)',
                left: 'calc(50% - 50px)',
            }}>
                <div style={{ borderRadius: '50%', width: '40px', height: '40px', backgroundColor: '#7086cb', margin: 'auto'}}>
                    <Spinner animation="grow" style={{color: '#364393', width: '40px', height: '40px'}}/>
                </div>
                <p >Loading</p>
            </div>

        </div>;
    }
}

export default LoadPage;