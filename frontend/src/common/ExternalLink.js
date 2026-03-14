import React from "react";

const ExternalLink = ({ url, children }) => {

  const onClick = event => {
    event.preventDefault();
    window.open(url)
  }

  return (<a href="#" onClick={onClick}>{children}</a>)
}

export default ExternalLink;
