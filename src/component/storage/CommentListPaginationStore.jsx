import axios from 'axios';
import { observable, action, configure } from 'mobx';


configure({ enforceActions: 'always' });


class CommentListPaginationStore {
  constructor(api) {
    this.comment_api = api;
  }

  // @observable comment_api=null;
  @observable current_page=1;

  @observable total_page=1;

  @observable limit=50;

  @observable loaded=false;

  @observable error=null;

  @observable comments=[];

  @observable loading=false;

  setApi(api) {
    this.comment_api = api;
  }

  @action fetchCommentPage(page = 1) {
    this.error = null;
    this.loaded = false;
    this.current_page = page;
    const api = this.comment_api;
    console.log(`fetching comments from page ${page}; ${api}`);

    const { limit } = this;
    const offset = (page - 1) * limit;

    axios.get(api, {
      params: { offset, limit },
      headers: { Accept: 'application/json' },
      transformResponse: undefined,
    })
      .then((res) => {
        const { data } = res;
        const api_result = JSON.parse(data);
        const { total, limit, comments } = api_result;

        const page_mod = total % limit;
        const page_div = Math.trunc(total / limit);
        let total_page = page_div;
        if (page_div == 0) {
          total_page = 1;
        } else if (page_mod != 0) {
          total_page = page_div + 1;
        }
        this.apiResult({
          comments,
          limit,
          current_page: page,
          total_page,
        });
      })
      .catch((res) => {
        let error = 'unknown server error';
        if (res.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const { data } = res.response;
          console.log('response', data);
          let json_resp = null;
          try {
            json_resp = JSON.parse(data);
          } catch (e) {
            // console.log(res.response);
            error = `${res.response.status} ${res.response.statusText}`;
          }
          if (json_resp) {
            error = json_resp.message || error;
          }
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', res);
          error = res.message;
        }
        console.log('set error to', error);
        // this.setState({error: error});
        // this.apiFailed(error);
        this.apiResult({
          error,
        });
      })
      .then(() => {
        console.log(`fetched comments from page ${page}; ${api}`);
      });
  }

  @action apiResult({
    loaded = true, error = null, comments = [], limit = 50, current_page = 1, total_page = 1,
  }) {
    // console.log('api finished', error, comments);
    this.loaded = loaded;
    this.error = error;
    this.comments = comments;
    this.limit = limit;
    this.current_page = current_page;
    this.total_page = total_page;
  }

  @action commentPush(comment) {
    // this.comments.push(comment);
    const comments = this.comments.slice();
    comments.push(comment);
    this.comments = comments;
  }
}


const commentListPaginationStore = new CommentListPaginationStore();

export default commentListPaginationStore;
