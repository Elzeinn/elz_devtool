import React from 'react';
import '../Style/TextUI.css';

const TextUI = ({ text, visible }) => {
  const formatText = (text) => {
    if (!text) return null; 
    const formattedText = text.replace(/\[(W|R|Q|LALT|E|ENTER)\]/g, (match) => {
      return `<span class="key">${match.replace(/\[|\]/g, '')}</span>`;
    });
    return formattedText.split('\n').map((line, index) => (
      <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
    ));
  };

  return (
    <div className={`text-ui-container ${visible ? 'visible' : 'hidden'}`}>
      <div className="text-ui-content">
        {formatText(text)}
      </div>
    </div>
  );
};

export default TextUI;
