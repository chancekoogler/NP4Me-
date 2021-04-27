import "./App.css";
import React from "react";
import { Navbar } from "react-bootstrap";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import Axios from 'axios'
import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom";

/* New Version Features:
  1. Reset scroll position to beginning when changing states

  3b. Add login authentication / save Features (this is somewhat done)
  3c. Add user/bucketlist 1:n relationship!

  8. Add functionality for multiple states / queries
    NOTE: Check if API can support multi state codes
    BIG FEATURE: Add location tracking for automatic suggestions of states
          based on location

  9. Add map functionality in seperate "More Info" page
    NOTE: iFrame is a possible solution? Further investigation needed

  10. Dyanmic routes for "More Information" pages
    NOTE: BIG(ish) FEATURE: Must do
    NOTE: load times not worth poor scrolling framerate
          revisit possibly to optimize
    NOTE: CSS could be cleaner but it's "good" for now

  13. Eventually add roadtrip feature
    NOTE: Tons of features could be added with this capability

  14. Change states array to key:value pairs for further accessibility/readability

  15. Add file drag and drop for image avatar

  16. Add more Bucketlist desc in photos

  17. BIG: Add notifications/redirect for form submissions! 
  

FINISHED 
-----DONE 2. BIG: Address specific states image resizing bug
-----DONE 3a. BIG:  MySQL integration!!
-----DONE 6. Image blur/opacity and add description for readability
-----DONE 7. Restyle select dropdown menu / button
-----DONE 11. Consider lazy loading of imgs for faster load times
-----DONE 11b. Reformat NavBar for cleaner design
-----DONE 12. Clean up tags
-----DONE 3d. Need to revisit, but only show unique Bucketlist items
*/


var states = [
  'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];


/* ----------------------------------- APP ----------------- */


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="app">
        <NavBar />
        <Switch>
          <Router exact path="/">
            <CreateForm />
          </Router>
          <Router exact path="/login">
            <Login />
          </Router>
          {/* <Router exact path="/park/:id"> For custom profile page
            <ParkPage />
          </Router> */}
          <Router exact path="/bucketlist">
            <BucketList />
          </Router>
        </Switch>
      </div>
    );
  }
}
/* ----------------------------------- MAIN PAGE ----------------- */


// get array of nps codes, map over them and print out data
class CreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.responseArray = []
  
  this.state = {
    fullName: "Default",
    results: [],
    selectValue: "AK",

  };
}
  handleChange = (e) => {
    this.setState({ selectValue: e.target.value })
  }
  // add state code to states array
  // componentDidMount() {

  // }
  
  // NPS API Call
  submitForm = () => {
    
    fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${this.state.selectValue}&api_key=PJiCCouDX6CSqqhH67IdrbGgJ2MeZMUS1zeTwu61`)
      .then((response) => response.json())
      .then((response2) => {
        console.log(response2)
        this.setState({
          results: response2.data
        })
        console.log(this.state.results)
        
    })
  }
  // post request to insert to bucketlist table
  addBucketlist = (res) => {
    Axios.post("http://localhost:5000/add-bucketlist", {
      name: res.fullName,
      location: res.states,
      image: res.images[0].url,
    }).then(console.log("Added to bucketlist"))
  }
  

  render() {
    return (
      <Router>
        <div>
          <div className="nav-and-form">
            <form>
              <label id="formLabel">Which State?</label>
              <select
                id="selDropdown"
                value={this.state.selectValue}
                name="Select"
                onChange={this.handleChange}
              >
                {states.map((states) => { // map over the states array
                  return (
                    <option id="option" key={states} value={states}>
                      {states}
                    </option>
                  );
                })}
              </select>
            </form>
            <Link to="/">
              <button onClick={() => this.submitForm()}>Explore!</button>
            </Link>
          </div>
          <div className="master-container">
            {this.state.results.map((result) => {
              if (result.images[0]) {
                // if there exists at least one image
                // create case for no image -> hit a diff API?
                return (
                  /* can optimize img load times with lazy load if
                      Clean up the HTML tags at the bottom of this - add to CSS instead

                    <Link to={`/park/${result.id}`}><p><b><u>More Info &gt;</u></b></p></Link> 
                    Add this to More Info for custom profile page for each park
                  */
                  <div className="flex-container">
                    <img
                      className="images"
                      src={`${result.images[0].url}`}
                      alt={result.images[0].altText}
                    />
                    <div className="image-desc">
                      <button onClick={() => this.addBucketlist(result)}>
                        Add to Bucketlist
                      </button>
                      <p>
                        {" "}
                        <b>{`${result.fullName}`}</b>
                      </p>
                      <p>
                        {" "}
                        <b>{`${result.description}`}</b>
                      </p>
                      
                      <a // make better with own custom profile pages for each NP

                        id="redirectLink"
                        href={`https://nps.gov/${result.parkCode}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <b>
                          <u>More Info</u>
                        </b>
                      </a>
                    </div>
                  </div>
                );
              }
            })} 
          </div>
        </div>
      </Router>
    );
      
  }


}

/* ----------------------------------- NAV BAR ----------------- */

class NavBar extends React.Component {
  
  
  render() {
    return (
      
      <Navbar
        className="navigationBar"
        expand="lg"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Link to="/login">
          <p className="userSection"> New User? </p>
        </Link>
        <Link to="/">
          <p className="userSection"> Home </p>
        </Link>
        <Link to="/bucketlist">
          <p className="userSection"> Bucketlist </p>
        </Link>
        <h1 id="np4me-header"> NP4Me, the National Park Catalogue</h1>
      </Navbar>
      
      
    );
  }
}

/* ----------------------------------- LOGIN / NEW USER FORM ----------------- */

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      location: "",
      imageAvatar: "",
    };
  }

  /*
  handleChangeUser = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  */

  // FIX THIS, SO DANG SLOPPY: DRY - don't repeat yourself! :( 
  handleChangeName = (e) => {
    this.setState({ name: e.target.value });
  };
  handleChangeLocation = (e) => {
    this.setState({ location: e.target.value });
  };
  handleChangeAvatar = (e) => {
    this.setState({ imageAvatar: e.target.value });
  };

  addUser = (e) => { // add notification for form submission
    e.preventDefault() // prevent page refresh, avoids XHR error
    Axios.post("http://localhost:5000/login", {
      name: this.state.name,
      location: this.state.location,
      avatarImage: this.state.imageAvatar,
    }).then(() => {
      console.log("success");
    });
  };

  render() {
    return (
      <div className="newUserForm">
        <form id="loginForm">
          <label className="loginLabel"> Full Name </label>
          <input
            type="text"
            className="loginInput"
            onChange={this.handleChangeName}
          />
          <label className="loginLabel"> Current City </label>
          <input
            type="text'"
            className="loginInput"
            onChange={this.handleChangeLocation}
          />
          <label className="loginLabel"> Avatar Image URL</label>
          <input
            type="text"
            className="loginInput"
            onChange={this.handleChangeAvatar}
          />
          <input type="submit" className="loginInput" onClick={this.addUser} />
        </form>
      </div>
    );
  }
}

/* Use Redux?
function ParkPage() {
  let { id } = useParams()
  return ( 
  <h1> {id} </h1>
  )
}
*/
class BucketList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bucketlist: [],
    };
  }

  getBucketlist = () => {
    Axios.get("http://localhost:5000/bucketlist").then((response) => {
      /*
        need to fix to address this on original insertion
        in the database, but this response "works" visually for now
      */
      console.log(response.data)
      this.setState({
        bucketlist: response.data,
      });
    });
  };

  componentDidMount() {
    this.getBucketlist();
  }

  render() {
    return (
      <div className="master-container">
        <p id="bucketlistTitle">
          <u><b> Bucketlist </b></u>
        </p>
        {
        this.state.bucketlist.map((result) => {
          return (
            <div className="flex-container">
              <img className="images" alt={result.name} src={result.image} />
              <div className="image-desc">
                <p>
                  <b>{`${result.name}`}</b>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}


export default App;
