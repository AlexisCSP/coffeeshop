import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import './Search.css'

class Search extends Component {
  constructor(props, context) {
    super(props, context);

    // Set initial State
    this.state = {
      // Current value of the select field
      value: "",
      // Data that will be rendered in the autocomplete
      // As it is asynchronous, it is initially empty
      autocompleteData: []
    };

    // Bind `this` context to functions of the class
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.getItemValue = this.getItemValue.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.retrieveDataAsynchronously = this.retrieveDataAsynchronously.bind(this);
  }


  /**
   * Updates the state of the autocomplete data with the remote data obtained via AJAX.
   *
   * @param {String} searchText content of the input that will filter the autocomplete data.
   * @return {Nothing} The state is updated but no value is returned
   */
  retrieveDataAsynchronously(searchText){
      let _this = this;

      let url = `http://localhost:3001/spotify/search/` + searchText;

      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = () => {
          let status = xhr.status;

          if (status === 200) {

              _this.setState({
                  autocompleteData: xhr.response
              });
          } else {
              console.error("Cannot load data from remote source");
          }
      };

      xhr.send();
  }

  /**
   * Callback triggered when the user types in the autocomplete field
   *
   * @param {Event} e JavaScript Event
   * @return {Event} Event of JavaScript can be used as usual.
   */
  onChange(e){
      this.setState({
          value: e.target.value
      });

      /**
       * Handle the remote request with the current text !
       */
      this.retrieveDataAsynchronously(e.target.value);
  }

  /**
   * Callback triggered when the autocomplete input changes.
   *
   * @param {Object} val Value returned by the getItemValue function.
   * @return {Nothing} No value is returned
   */
  onSelect(val, item){
      this.setState({
          value: val
      });

      this.props.onSearchItemClick(item)
  }

  /**
   * Define the markup of every rendered item of the autocomplete.
   *
   * @param {Object} item Single object from the data that can be shown inside the autocomplete
   * @param {Boolean} isHighlighted declares wheter the item has been highlighted or not.
   * @return {Markup} Component
   */
  renderItem(item, isHighlighted){
      return (
          <div className="song-search-result" style={{ background: isHighlighted ? 'lightgray' : 'white', cursor: isHighlighted? 'pointer' : 'default' }}>
              <img src={item.album_image} alt={item.song} height={40} width={40}/>
              <span className="song-search-result-data">{item.song} - {item.artist}</span>
          </div>
      );
  }

  /**
   * Define which property of the autocomplete source will be show to the user.
   *
   * @param {Object} item Single object from the data that can be shown inside the autocomplete
   * @return {String} val
   */
  getItemValue(item){
      return `${item.song} - ${item.artist}`;
  }

  render() {
      return (
            <Autocomplete
                className="background-secondary-main color-secondary-text"
                getItemValue={this.getItemValue}
                items={this.state.autocompleteData}
                renderItem={this.renderItem}
                value={this.state.value}
                onChange={this.onChange}
                onSelect={this.onSelect}
                wrapperStyle={{display: 'block', marginLeft: 'auto', width: '500px', marginRight: 'auto', marginTop: '20px' }}
                inputProps={{ id: "searchbar", placeholder:"Search for your favourite songs..." }}

            />
      );
  }
}

export default Search;
