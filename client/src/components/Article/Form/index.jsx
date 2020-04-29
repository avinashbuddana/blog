import axios from 'axios';
import React from 'react';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { connect } from 'react-redux';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: EditorState.createEmpty(),
      author: '',
    }

    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.articleToEdit) {

      const contentBlock = htmlToDraft(nextProps.articleToEdit.body);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        title: nextProps.articleToEdit.title,
        body: editorState,
        author: nextProps.articleToEdit.author,
      });
    }
  }
}

  handleSubmit(){
    const { onSubmit, articleToEdit, onEdit } = this.props;
    let { title, body, author } = this.state;

    if(body){
    body =  draftToHtml(convertToRaw(this.state.body.getCurrentContent()))
    }
    if(!articleToEdit) {
      return axios.post('http://localhost:8000/api/articles', {
        title,
        body,
        author,
      })
        .then((res) => onSubmit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '' }));
    } else {
      return axios.patch(`http://localhost:8000/api/articles/${articleToEdit._id}`, {
        title,
        body,
        author,
      })
        .then((res) => onEdit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '' }));
    }
  }

  handleChangeField(key, event) {
   
         this.setState({
      [key]: key=='body' ? event:event.target.value,
    });
  }


 uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/image');
      xhr.setRequestHeader('Authorization', 'Client-ID c7f382f5d42c47a');
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );
}
  



  render() {
    const { articleToEdit } = this.props;
    const { title, body, author } = this.state;

    return (
      <div className="col-12 col-lg-6 offset-lg-3">
        <input
          onChange={(ev) => this.handleChangeField('title', ev)}
          value={title}
          className="form-control my-3"
          placeholder="Article Title"
        />


<Editor
          editorState={body}
          wrapperClassName="wrapper-class"
editorClassName="editor-class"
toolbarClassName="toolbar-class"
wrapperStyle={{ border: "2px solid black", marginBottom: "20px" }}
editorStyle={{ height: "300px", padding: "10px" ,'backgroundColor':'white' }}
          onEditorStateChange={(ev) => this.handleChangeField('body', ev)}
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
          
        />
       
        {/* <textarea
          onChange={(ev) => this.handleChangeField('body', ev)}
          className="form-control my-3"
          placeholder="Article Body"
          value={body}>
        </textarea> */}
        <input
          onChange={(ev) => this.handleChangeField('author', ev)}
          value={author}
          className="form-control my-3"
          placeholder="Article Author"
        />
        <button onClick={this.handleSubmit} className="btn btn-primary float-right">{articleToEdit ? 'Update' : 'Submit'}</button>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onSubmit: data => dispatch({ type: 'SUBMIT_ARTICLE', data }),
  onEdit: data => dispatch({ type: 'EDIT_ARTICLE', data }),
});

const mapStateToProps = state => ({
  articleToEdit: state.home.articleToEdit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);