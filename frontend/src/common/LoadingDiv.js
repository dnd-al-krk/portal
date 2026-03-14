import styled from "styled-components";
import {ClipLoader} from "react-spinners";
import React from "react";

export const LoadingDiv = styled.div`
  position:fixed;
  top: 50%;
  left: 50%;
  width: 4em;
  height: 2em;
  margin-left: -2em;
  margin-top: -1em;
  text-align: center;
  color: #888;
  font-size: 2em;
`;


const Spinner = (props) => (
  <LoadingDiv>
    <ClipLoader color={'#DF9E00'} loading={props.loading}/>
  </LoadingDiv>
);

export default Spinner;
