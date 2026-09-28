import React from 'react';
import styled from 'styled-components';

const Loader = ({ fadeOut }) => {
  return (
    <LoaderContainer className={fadeOut ? 'fade-out' : ''}>
      <StyledWrapper>
        <div className="newtons-cradle">
          <div className="newtons-cradle__dot" />
          <div className="newtons-cradle__dot" />
          <div className="newtons-cradle__dot" />
          <div className="newtons-cradle__dot" />
        </div>
      </StyledWrapper>
    </LoaderContainer>
  );
};

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-color, #130D14);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  transition: opacity 0.6s ease-in-out, visibility 0.6s ease-in-out;
  opacity: 1;
  visibility: visible;

  &.fade-out {
    opacity: 0;
    visibility: hidden;
  }
`;

const StyledWrapper = styled.div`
  .newtons-cradle {
    --uib-size: 50px;
    --uib-speed: 1.2s;
    --uib-color: var(--text-primary, #474554);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--uib-size);
    height: var(--uib-size);
  }

  .newtons-cradle__dot {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    width: 25%;
    transform-origin: center top;
  }

  .newtons-cradle__dot::after {
    content: '';
    display: block;
    width: 100%;
    height: 25%;
    border-radius: 50%;
    background-color: var(--uib-color);
  }

  .newtons-cradle__dot:first-child {
    animation: swing var(--uib-speed) linear infinite;
  }

  .newtons-cradle__dot:last-child {
    animation: swing2 var(--uib-speed) linear infinite;
  }

  @keyframes swing {
    0% {
      transform: rotate(0deg);
      animation-timing-function: ease-out;
    }

    25% {
      transform: rotate(70deg);
      animation-timing-function: ease-in;
    }

    50% {
      transform: rotate(0deg);
      animation-timing-function: linear;
    }
  }

  @keyframes swing2 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: linear;
    }

    50% {
      transform: rotate(0deg);
      animation-timing-function: ease-out;
    }

    75% {
      transform: rotate(-70deg);
      animation-timing-function: ease-in;
    }
  }
`;

export default Loader;
