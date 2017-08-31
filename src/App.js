import React, { Component } from 'react';
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
      previewText: 'The Typographer',
      paragraphPreviewText: 'Generate Awesome Typeface Combinations with Google Fonts API, Modular Scale and Randomization.',
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

  async componentDidMount() {
    const serverRequest = await (await fetch(url)).json();
    this.setState({
      typefaces: serverRequest.items
    });
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
        <aside className="functions element">
          <input onChange={this.updatePreviewText} value={this.state.previewText} type="text" />
          <button onClick={this.generateNew}>New Combination</button>
          <button className={this.state.firstLocked ? 'locked' : ''} onClick={() => this.toggleLock(1)}>Lock #1</button>
          <button className={this.state.secondLocked ? 'locked' : ''} onClick={() => this.toggleLock(2)}>Lock #2</button>
        </aside>
        <textarea className="element" onChange={this.updateParagraphPreviewText} value={this.state.paragraphPreviewText}></textarea>
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

  const fetchAsyncA = async () => await (await fetch('https://fonts.googleapis.com/css?family='+typeface.family)).json()
  var newStyle = document.createElement('style');
  newStyle.appendChild(document.createTextNode(fetchAsyncA));
  document.head.appendChild(newStyle);
  

  const classes = cx('Typeface', locked ? 'locked' : '');

  return (
    <section className={classes}>
      <header>
        <h2><a target="_blank" title="View Specimen in Google Fonts" href={'https://fonts.google.com/specimen/'+typeface.family.split(' ').join('+') }>{typeface.family} <span>({typeface.category})</span></a></h2>
        <h3><a target="_blank" title="Copy @font-face definition" href={'https://fonts.googleapis.com/css?family='+typeface.family.split(' ').join('+') }>@font-face definition</a></h3>
        <h3 className="font-link-tag">{"<link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family="+typeface.family.split(' ').join('+')+">"}</h3>
      </header>
      <section style={{ fontFamily: typeface.family }}>
        <Headings previewText={previewText} />
        <p>{paragraphPreviewText}</p>
      </section>
      <h3 className="font-options">Options</h3>
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
            <a href={files[key]} key={index}><strong>{key}</strong></a>
          </li>
        )
      })
    }
    </ul>
  )
}

export default App;