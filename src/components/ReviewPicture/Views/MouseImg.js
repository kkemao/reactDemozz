import React, { Component } from 'react';

import ReactImageZoom from 'react-image-zoom';
class MouseImg extends Component {
    
    render() {
        const {mouseImgClientY, mouseImgClientX, mouseSrc} =this.props;
        const objStyle = {
            top: mouseImgClientY+80,
            left: mouseImgClientX
        }
        const propsImg ={"width":200,"height":110,"zoomWidth":500,"scale":5,"img":mouseSrc,"offset":{"vertical":0,"horizontal":10},"zoomStyle ":{}, "zoomLensStyle": { "opacity": 0.4,"background-color": "gray"}};
        return (
            <div className="mouse-img" style={objStyle}>
                    {/* <ReactImageZoom
                        {...propsImg}
                    /> */}
                    <img src={mouseSrc} alt='' />
            </div>
        )
    }
}

export default MouseImg;