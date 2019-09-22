import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  width: 100%;
  height: auto;
  clear: both;
  position: relative;
  background-color: #000;
  overflow: hidden;
  & * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
  }
`;

const Wrapper = styled.div`
  width: auto;
  display: flex;
  flex-wrap: nowrap;
  will-change: transform;
  height: 100%;
  user-select: none;
  transition: transform 0.65s cubic-bezier(0, 0.69, 0.74, 0.9);
`;

const Slide = styled.div`
  background-color: ${({ color }) => color};
  width: 100%;
  flex-shrink: 0;
  height: auto;
  user-select: none;
  overflow: auto;
  & * {
    vertical-align: middle;
    user-select: none;
  }
  & img {
    max-width: 100%;
  }
`;

const NavWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  backdrop-filter: blur(3px);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
`;

const DotWrapper = styled.div`
  width: 20px;
  height: 20px;
  opacity: ${({ active }) => (active ? "1" : "0.5")};
  display: inline-block;
  vertical-align: middle;
  margin: 2px 5px;
  cursor: pointer;
`;

const DotCircleAnimation = keyframes`
  from {
    stroke-dashoffset: 565px;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

const DotCircle = styled.circle`
  fill: none;
  stroke-width: 20;
  stroke: #ffffff;
  stroke-dasharray: 565px;
  stroke-dashoffset: 565px;
  animation: ${DotCircleAnimation} ${({ time }) => time}s linear forwards;
  animation-play-state: ${({ pause }) => (pause ? "paused" : "running")};
`;

const DotCenter = styled.circle`
  fill: #ffffff;
`;
// const Dot = styled.div`
//   width: 15px;
//   height: 15px;
//   margin: 0px 10px;
//   vertical-align: middle;
//   display: inline-block;
//   border-radius: 50%;
//   background-color: white;
//   cursor: pointer;
//   opacity: ${({ isActive }) => (isActive ? "1" : "0.6")};
//   box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
//   &:hover {
//     opacity: 1;
//   }
//   @media screen and (max-width: 768px) {
//     width: 10px;
//     height: 10px;
//     margin: 3px;
//   }
// `;

function Dot(props) {
  return (
    <DotWrapper active={props.active} onClick={props.onClick}>
      <svg
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 200 200"
        style={{ enableBackground: "new 0 0 200 200" }}
        space="preserve"
      >
        <DotCenter cx="100" cy="100" r="50" />
        {props.active && (
          <DotCircle
            pause={props.pause}
            time={props.time || 5}
            cx="100"
            cy="100"
            r="90"
          />
        )}
      </svg>
    </DotWrapper>
  );
}

class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      carouselWidth: 0,
      pauseAnimation: false
    };

    this.wrapper = React.createRef();
    this.container = React.createRef();

    this.currentX = 0;
    this.currentSlideIndex = 0;
    this.autoPlayTimer = null;
    this.tick = 0;
  }

  componentDidMount() {
    const { autoPlay } = this.props;
    const container = this.container.current || {};
    this.setState({
      carouselWidth: container.clientWidth
    });

    //window.addEventListener("resize", this.handleResize);

    if (autoPlay) {
      this.startAutoPlay();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("touchmove", this.handleMove);
    document.removeEventListener("mouseup", this.handleFingerUp);
    document.removeEventListener("touchend", this.handleFingerUp);
    document.removeEventListener("scroll", this.muteevent);
  }

  startAutoPlay = () => {
    const { interval, slides } = this.props;

    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    this.autoPlayTimer = setInterval(() => {
      this.tick += 0.25;
      if (this.tick === interval) {
        let index =
          this.currentSlideIndex === slides.length - 1
            ? 0
            : this.currentSlideIndex + 1;

        this.handleSelectSlide(index);
        this.tick = 0;
      }
    }, 250);
  };

  stopAutoPlay = () => {
    clearInterval(this.autoPlayTimer);
  };

  eventNormalizer = e => {
    switch (e.type) {
      case "touchmove":
      case "touchdown":
      case "touchend":
      case "touchstart":
        return {
          x: e.targetTouches[0].clientX
        };
      case "mousemove":
      case "mousedown":
        return {
          x: e.clientX
        };
      default:
        return {
          x: 0
        };
    }
  };

  muteevent = () => {};

  handleResize = () => {
    this.handleSelectSlide(this.currentSlideIndex, true);
  };

  handleFingerDown = e => {
    const move = this.eventNormalizer(e);
    const wrapper = this.wrapper.current;

    wrapper.style.transition = "none";

    this.offset = move.x - this.currentX;

    //add listeners
    document.addEventListener("mousemove", this.handleMove);
    document.addEventListener("touchmove", this.handleMove);
    document.addEventListener("mouseup", this.handleFingerUp);
    document.addEventListener("touchend", this.handleFingerUp);
    document.addEventListener("scroll", this.muteevent);
  };

  percenIndex = 0;

  handleMove = e => {
    const move = this.eventNormalizer(e);
    const wrapper = this.wrapper.current;
    const container = this.container.current;

    const end =
      container.clientWidth - this.props.slides.length * container.clientWidth;
    const start = 0;

    let x = move.x - this.offset;

    if (x < end) {
      x = end;
    }

    if (x > start) {
      x = start;
    }

    this.currentX = x;

    this.wrapper.current.style.transform = `translateX(${this.currentX}px)`;
  };

  handleFingerUp = e => {
    const wrapper = this.wrapper.current;
    const container = this.container.current;
    const fingerUpPos = this.currentX;
    const { slides, resitanceSensivity } = this.props;

    //remove listeners
    document.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("touchmove", this.handleMove);
    document.removeEventListener("mouseup", this.handleFingerUp);
    document.removeEventListener("touchend", this.handleFingerUp);
    document.removeEventListener("scroll", this.muteevent);

    wrapper.style.transition =
      "transform cubic-bezier(0, 0.69, 0.74, 0.9) 0.65s";

    let slideStartPos, slideEndPos;
    let changeField = -(container.clientWidth / resitanceSensivity);
    let beforeChangeIndex = this.currentSlideIndex;
    let prevSlideStartPos = -(
      (this.currentSlideIndex - 1) *
      container.clientWidth
    );
    let currentSlideStartPos = -(
      this.currentSlideIndex * container.clientWidth
    );

    //find current position of slide
    for (let i = 0; i < slides.length; i++) {
      slideStartPos = -(i * container.clientWidth);
      slideEndPos = -((i + 1) * container.clientWidth);
      if (
        this.currentX < slideStartPos + changeField &&
        this.currentX > slideEndPos
      ) {
        this.currentX = slideEndPos;
        this.currentSlideIndex = i + 1;
        break;
      }
    }

    //prev slide
    if (beforeChangeIndex === this.currentSlideIndex) {
      if (this.currentSlideIndex > 0) {
        if (
          fingerUpPos > -changeField + currentSlideStartPos &&
          fingerUpPos > currentSlideStartPos
        ) {
          this.currentX = prevSlideStartPos;
          this.currentSlideIndex = this.currentSlideIndex - 1;
        }
      }
      this.handleSelectSlide(this.currentSlideIndex);
      return;
    }

    //resistance
    this.handleSelectSlide(this.currentSlideIndex);
  };

  handleTransitionEnd = e => {};

  handleSelectSlide = (index, correction) => {
    const wrapper = this.wrapper.current;
    const container = this.container.current;
    this.currentSlideIndex = index;
    this.currentX = -(index * container.clientWidth);
    wrapper.style.transform = `translateX(${this.currentX}px)`;
    if (!correction) {
      this.setState({
        selectedIndex: this.currentSlideIndex
      });
      this.tick = 0;
      this.startAutoPlay();
    }
  };

  handleMouseOverCarousel = () => {
    this.stopAutoPlay();
    this.setState({
      pauseAnimation: true
    });
  };

  handleMouseOutCarousel = () => {
    if (this.props.autoPlay) {
      this.startAutoPlay();

      this.setState({
        pauseAnimation: false
      });
    }
  };

  wrapperEvents = {
    onMouseDown: this.handleFingerDown,
    onTouchStart: this.handleFingerDown,
    onTransitionEnd: this.handleTransitionEnd
  };

  containerEvents = {
    onMouseEnter: this.handleMouseOverCarousel,
    onMouseLeave: this.handleMouseOutCarousel
  };

  render() {
    const { slides, interval, autoPlay } = this.props;
    const { carouselWidth, pauseAnimation } = this.state;
    return (
      <Container ref={this.container} {...this.containerEvents}>
        <Wrapper
          draggable={false}
          ref={this.wrapper}
          width={slides.length * carouselWidth}
          {...this.wrapperEvents}
        >
          {slides.map((slide, index) => (
            <Slide
              draggable={false}
              color={slide.color}
              width={carouselWidth}
              key={index}
              aria-hidden={index !== this.currentSlideIndex}
            >
              {slide.image && (
                <img draggable={false} src={slide.image} alt="Domino's Pizza" />
              )}
            </Slide>
          ))}
        </Wrapper>
        <NavWrapper>
          {slides.map((slide, index) => (
            <Dot
              active={index === this.currentSlideIndex && autoPlay}
              pause={pauseAnimation}
              key={index}
              onClick={() => this.handleSelectSlide(index, slide)}
              time={interval}
            />
          ))}
        </NavWrapper>
      </Container>
    );
  }
}

Carousel.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      color: PropTypes.string
    })
  ),
  resitanceSensivity: PropTypes.number,
  autoPlay: PropTypes.bool
};

Carousel.defaultProps = {
  slides: [],
  resitanceSensivity: 5,
  interval: 6,
  autoPlay: true
};

export default Carousel;
