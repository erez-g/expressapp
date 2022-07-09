import React, {useState} from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './carousel.css';

const dataItems = [
  {
    path:"https://picsum.photos/id/237/200/300",
    title:"Lorem"
  },
  {
    path:"https://picsum.photos/id/238/200/300",
    title:"Ipsum"
  },
  {
    path:"https://picsum.photos/id/239/200/300",
    title:"Lorem"
  },
  {
    path:"https://picsum.photos/id/240/200/300",
    title:"Ipsum"
  },
  {
    path:"https://picsum.photos/id/241/200/300",
    title:"Lorem"
  },
  {
    path:"https://picsum.photos/id/242/200/300",
    title:"Ipsum"
  },
  {
    path:"https://picsum.photos/id/243/200/300",
    title:"Lorem"
  },
  {
    path:"https://picsum.photos/id/244/200/300",
    title:"Ipsum"
  }
]

const thumbItems = (items, [setThumbIndex]) => {
  return items.map((item, i) => (
      <div className="thumb" onClick={() => (setThumbIndex(i))}>
          {item}
      </div>
  ));
};
const ContentRow = (props) => {
  const handleDragStart = (e) => {
    console.log('e:',e);
    e.preventDefault();
  }
  const items = dataItems.map((item,index)=>{
    return <img key={index} src={item.path} onDragStart={handleDragStart} role="presentation"/>
  })
  const [thumbIndex, setThumbIndex] = useState(0);
  const [thumbs] = useState(thumbItems(items, [setThumbIndex]));


  const slideNext = () => {
    if (thumbIndex < thumbs.length - 1) {
      setThumbIndex(thumbIndex + 1);
    }
  };
  
  const slidePrev = () => {
      if (thumbIndex > 0) {
          setThumbIndex(thumbIndex - 1);
      }
  };
  const syncThumbs = (e) => {
    console.log(e)
    setThumbIndex(e.item);

};

  const responsive = {
      0: { items: 1 },
      1024: { items: 7 },
  }
  const {title,type} = props;
  return (
    <>
    <h1 className="contentTitle">{title}</h1>
    <div style={{position:"relative"}}>
    <AliceCarousel mouseTracking
      responsive={responsive}
      activeIndex={thumbIndex}
      items={items} 
      controlsStrategy="default"
      disableButtonsControls
      onSlideChange={(e)=>console.log(e)}
      onSlideChanged={syncThumbs}
      animationType="slide"
      animationDuration={800}
    />
    <div className="btn-prev" onClick={slidePrev}>&lang;</div>
    <div className="btn-next" onClick={slideNext}>&rang;</div>
  
    </div>
    </>
  );
}


export default ContentRow