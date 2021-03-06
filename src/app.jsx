/** @jsx React.DOM */
var Container = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row clearfix">
          {this.props.children}
        </div>
      </div>
    );
  }
});


function makeUsCodeUrl(citation) {
  var usc = citation.usc;
  var title = usc.title;
  var section = usc.section;
  return "http://www.law.cornell.edu/uscode/text/" + title + "/" + section;
}

function makeCfrUrl(citation) {
  var cfr = citation.cfr;
  var title = cfr.title;
  var section = cfr.part;
  return "http://www.law.cornell.edu/cfr/text/" + title + "/" + section;
}

function makeDcCodeUrl(citation) {
  var dc_code = citation.dc_code;
  var title = dc_code.title;
  var section = dc_code.section;
  return "http://dccode.org/browser/#/" + title + "/" + title + "-" + section;
}

function makeJudicialUrl(citation) {
  console.log("judicialing");
  // nice 'n easy
  return "https://casetext.com/search#!/?q=" + citation.match;
}

function makeUrl(citation) {
  if (citation.type === "usc") { return makeUsCodeUrl(citation); }
  if (citation.type === "cfr") { return makeCfrUrl(citation); }
  if (citation.type === "dc_code") { return makeDcCodeUrl(citation); }
  if (citation.type === "judicial") { return makeJudicialUrl(citation); }

  // if no match, silently default to the plain text
  return citation.match;
}

var makeATag = function(name, href) {
  var open = "<a href='" + href +"'>";
  var middle = name;
  var close = "</a>"

  return open + middle + close;
}


var citations = function(converter) {
  return  [
    { 
      type: 'output', 
      filter: function(source) {
        var matches = Citation.find(source)['citations'];


        if (matches === 0) {
          console.log("exited");
          return source;
        }

        for (var i=0,len=matches.length; i<len; i++) { 
          var match = matches[i].match;
          source = source.replace(match, makeATag(match, makeUrl(matches[i])));
        }

        return source;
      }
    }
  ];
};
window.Showdown.extensions.citations = citations; 

var converter = new Showdown.converter({ extensions: ['citations'] });

var MarkdownEditor = React.createClass({
  getInitialState: function() {
    return {value: 'Type some *markdown* here!. Legal citations become links.\n\nSee, e.g., 35 USC 112 and Ashcroft v. Iqbal, 556 U.S. 662 (2009).'};
  },
  handleChange: function() {
    this.setState({value: this.refs.textarea.getDOMNode().value});
  },
  render: function() {
    return (
      <div className="MarkdownEditor">
        <div className="col-md-6 column">
          <h3>Input</h3>
          <textarea className="field span20" id="textarea" rows="25" cols="60"
            onChange={this.handleChange}
            ref="textarea"
            defaultValue={this.state.value} />
        </div>
        <div className="col-md-6 column">
          <h3>Output</h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: converter.makeHtml(this.state.value)
            }}
          />
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <Container>
    <MarkdownEditor />
  </Container>,
  document.getElementById("content")
);