import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import renderHTML from 'react-render-html';

import { Form } from '../../components/Article';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    const { onLoad,list } = this.props;
    let route = this.props.history.location.pathname;
    route = route.split("/").pop();
  axios(`http://localhost:8000/api/articles/${route}`)
      .then((res) => list(res.data));
  }

  handleDelete(id) {
    const { onDelete } = this.props;

    return axios.delete(`http://localhost:8000/api/articles/${id}`)
      .then(() => onDelete(id));
  }

  handleEdit(article) {
    const { setEdit } = this.props;

    setEdit(article);
  }

  render() {
    const { articles } = this.props;
    

    return (
      (Object.keys(articles).length > 0 ?

      
      <div className="container">
        <div className="row pt-5">
         <h3 style={{width:'100%'}}><b> {articles.title} </b></h3>
         <div>
         {
          articles.body ? renderHTML(articles.body) : ""
          }
         </div>
         </div>
      </div>
      : <div class="container h-100">
        
        <div class="row h-100 justify-content-center  align-middle">
       
       <h3> NO BLOGS FOUND</h3>
       
       </div>
      </div>)
    );
  }
}

const mapStateToProps = (state) => {
  
  return {
    articles: state.home.articles,
}
};

const mapDispatchToProps = dispatch => ({
  // onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
  // onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
  // setEdit: article => dispatch({ type: 'SET_EDIT', article }),
  list:data => dispatch({type:'LIST_BLOG',data})
});

export default connect(mapStateToProps, mapDispatchToProps)(List);