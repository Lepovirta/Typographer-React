import React, { Component } from 'react';
import $ from 'jquery';
import ms from 'simple-modular-scale';
import cx from 'classnames';

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
      previewText: 'Try Changing Me!',
      paragraphPreviewText: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
      typefaces: [],
      firstFont: '',
      secondFont: '',
      firstLocked: false,
      secondLocked: false
    };
    this.generateNew = this.generateNew.bind(this);
    this.toggleLock = this.toggleLock.bind(this);
  }

  generateNew() {
    this.setState(prevState => ({
      firstFont: prevState.firstLocked ? prevState.firstFont : newTypeface(prevState.typefaces),
      secondFont: prevState.secondLocked ? prevState.secondFont : newTypeface(prevState.typefaces)
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

  updatePreviewText = (e) => {
    this.setState({previewText: e.target.value})
  }

  updateParagraphPreviewText = (e) => {
    this.setState({paragraphPreviewText: e.target.value})
  } 

  render() {

    return (
      <div className="App">
        <h1>The Typographer 2.0</h1>
        <h2>Generate Awesome Typeface Combinations with Google Fonts API, Modular Scale and Randomization.</h2>
        <aside className="functions">
          <input onChange={this.updatePreviewText.bind(this)} value={this.state.previewText} type="text" />
          <button onClick={this.generateNew}>New Combination (enter)</button>
          <button className={this.state.firstLocked ? 'locked' : ''} onClick={() => this.toggleLock(1)}>Lock #1</button>
          <button className={this.state.secondLocked ? 'locked' : ''} onClick={() => this.toggleLock(2)}>Lock #2</button>
        </aside>
        <textarea onChange={this.updateParagraphPreviewText.bind(this)} value={this.state.paragraphPreviewText}></textarea>
        <div className="typefaces">
          {this.state.firstFont &&
            <Typeface 
              previewText={this.state.previewText}
              paragraphPreviewText={this.state.paragraphPreviewText}
              locked={this.state.firstLocked}
              typeface={this.state.firstFont} /> }
          {this.state.secondFont &&
            <Typeface 
              previewText={this.state.previewText}
              paragraphPreviewText={this.state.paragraphPreviewText}
              locked={this.state.secondLocked}
              typeface={this.state.secondFont} /> }
          </div>
      </div>
    );
  }
}

const Typeface = ({locked, typeface, previewText, paragraphPreviewText}) => {

  $.get('https://fonts.googleapis.com/css?family='+typeface.family, function (result) {
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode(result));
    document.head.appendChild(newStyle);
  });
  

  const classes = cx('Typeface', locked ? 'locked' : '');

  return (
    <section className={classes}>
      <header>
        <h2><a title="View Specimen" href={'https://fonts.google.com/specimen/'+typeface.family.split(' ').join('+') }>{typeface.family} <span>({typeface.category})</span></a></h2>
        <h3><a title="Copy @font-face" href={'https://fonts.googleapis.com/css?family='+typeface.family.split(' ').join('+') }>@font-face</a></h3>
        <h3>{"<link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family="+typeface.family.split(' ').join('+')+">"}</h3>
      </header>
      <section style={{ fontFamily: typeface.family }}>
        <Headings previewText={previewText} />
        <p>{paragraphPreviewText}</p>
      </section>
      <Links files={typeface.files} />
    </section>
  );
}

const Headings = ({previewText}) => {
  
  var scale = ms({
    base: 16,
    ratios: [5/4],
    length: 6
  })

  var headingExamples = [];
  for (var i = 0; i < 6; i++) {
    headingExamples.push(
      <p key={i} style={{ fontSize: scale[i]+'px' }}>{previewText}</p>
    );
  }
  headingExamples.reverse();
  return (
    <section className="Headings">
      {headingExamples}
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