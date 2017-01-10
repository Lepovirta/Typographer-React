import React, { Component } from 'react';
import $ from 'jquery';
import ms from 'simple-modular-scale';

import './App.css';

const url = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCZt1_L89iUTbDM6HROG5ivZ01ngau-86Y';

const randomArrayElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

const newTypeface = (typefaces) => {
  return randomArrayElement(typefaces);
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      typefaces: [],
      typeface: '',
      firstLocked: false,
      secondLocked: false
    };
    this.generateNew = this.generateNew.bind(this);
    this.toggleLock = this.toggleLock.bind(this);
  }

  generateNew() {
    this.setState(prevState => ({
      typeface: newTypeface(prevState.typefaces)
    }));
  }

  toggleLock(fontNumber) {
    if(fontNumber === 1) {
      this.setState(prevState => ({
        firstLocked: !prevState.firstLocked
      }));
    }
   if(fontNumber === 2) {
      this.setState(prevState => ({
        secondLocked: !prevState.secondLocked
      }));
    }    
  }

  componentDidMount() {
    this.serverRequest = $.get(url, function (result) {
      this.setState({
        typefaces: result.items
      });
    }.bind(this));
  }

  componentWillMount(e) {
    window.addEventListener('keydown', function (e) {
      if (event.key === 'Enter') {
        this.generateNew();
      }
    }.bind(this));
    this.generateNew();
  }  

  render() {

    return (
      <div className="App">
        <h1>The Typographer 2.0</h1>
        <h2>Generate Awesome Typeface Combinations with Google Fonts API, Modular Scale and Randomization.</h2>
        <aside className="functions">
          <button onClick={this.generateNew}>New Combination (enter)</button>
          <button className={this.state.firstLocked ? 'locked' : ''} onClick={() => this.toggleLock(1)}>Lock #1</button>
          <button className={this.state.secondLocked ? 'locked' : ''} onClick={() => this.toggleLock(2)}>Lock #2</button>
        </aside>
        {this.state.typeface && 
          <Typeface 
            firstLocked={this.state.firstLocked} 
            secondLocked={this.state.secondLocked} 
            typeface={this.state.typeface} />
        }
      </div>
    );
  }
}

const Typeface = ({firstLocked, secondLocked, typeface}) => {

  $.get('https://fonts.googleapis.com/css?family='+typeface.family, function (result) {
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode(result));
    document.head.appendChild(newStyle);
  });  
  
  return (
    <section className="Typeface">
      <header>
        <h2><a title="View Specimen" href={'https://fonts.google.com/specimen/'+typeface.family.split(' ').join('+') }>{typeface.family} <span>({typeface.category})</span></a></h2>
        <h3><a title="Copy @font-face" href={'https://fonts.googleapis.com/css?family='+typeface.family.split(' ').join('+') }>@font-face</a></h3>
        <h3>{"<link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family="+typeface.family.split(' ').join('+')+">"}</h3>
      </header>
      <section style={{ fontFamily: typeface.family }}>
        <Headings firstLocked={firstLocked} />
        <p>Google Fonts makes it quick and easy for everyone to use web fonts, including professional designers and developers. We believe that everyone should be able to bring quality typography to their web pages and applications.</p>
        <p>Our goal is to create a directory of web fonts for the world to use. Our API service makes it easy to add Google Fonts to a website in seconds. The service runs on Google's servers which are fast, reliable and tested. Google provides this service free of charge.</p>
        <p>All of the fonts are Open Source. This means that you are free to share your favorites with friends and colleagues. You can even customize them for your own use, or collaborate with the original designer to improve them. And you can use them in every way you want, privately or commercially — in print, on your computer, or in your websites.</p>
      </section>
      <Links files={typeface.files} />
    </section>
  );
}

const Headings = () => {
  
  var scale = ms({
    base: 16,
    ratios: [5/4],
    length: 6
  })

  var headingExamples = [];
  for (var i = 0; i < 6; i++) {
    headingExamples.push(
      <p key={i} style={{ fontSize: scale[i]+'px' }}>Lorem Ipsum Dipsum Pupsum</p>
    );
  }
  headingExamples.reverse();
  return (
    <section className="Headings">
      <div>
        {headingExamples}
      </div>
    </section>
  )
}

const Links = ({files}) => {
  return (
    <ul className="Links">
    {
      Object.keys(files).map((key, index) => {
        return (
          <li key={index}>
            <strong>{key}</strong><a href={files[key]} key={index}> {files[key]}</a>
          </li>
        )
      })
    }
    </ul>
  )
}

export default App;