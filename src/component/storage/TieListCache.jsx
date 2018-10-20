import axios from 'axios';


class TieListCache {

  constructor() {
    this.cache_limit = 1000;
    this.tie_id_buffer = [];
    this.id_to_ties = {};
  }

  cacheTies(ties) {
    let tie_id_buffer = this.tie_id_buffer;
    const limit = this.cache_limit;
    const overflow_count = tie_id_buffer.length + ties.length - limit;
    let removed_tie_ids = tie_id_buffer.concat(
      ties.map((tie, _index) => { return tie['id']; })
    );
    let updated_tie_ids = removed_tie_ids.splice(overflow_count - 1);
    ties.map((new_tie, _index) => {
      const tie_id = new_tie['id'];
      console.log(`adding tie cache ${tie_id}`);
      this.id_to_ties[tie_id] = new_tie;
    });

    removed_tie_ids.map((tie_id, _index) => {
      console.log(`removing tie cache ${tie_id}`);
      delete this.id_to_ties[tie_id];
    });
    this.tie_id_buffer = updated_tie_ids;
  }

  fetchTie(tie_id, resolve, reject) {
    const cached_tie = this.id_to_ties[tie_id];
    if(cached_tie) {
      return resolve(cached_tie);
    };

    axios.get(`/api/tie/${tie_id}`, {
        headers: {'Accept': 'application/json'},
        transformResponse: undefined
      })
      .then(res => {
        var data = res.data;
        var tie = JSON.parse(data);
        return resolve(tie);
      })
      .catch(res => {
        var error = 'unknown server error';
        if (res.response) {
            // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          var data = res.response.data;
          console.log('response', data);
          var json_resp = null;
          try {
            json_resp = JSON.parse(data);
          } catch (e) {
            // console.log(res.response);
            error = `${res.response.status} ${res.response.statusText}`;
          };
          if(json_resp) {
            error = json_resp.message || error;
          };
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', res);
          error = resp.message;
        };
        console.log('set error to', error);
        // this.setState({error: error});
        // this.apiFailed(error);
        return reject(error);
      })
      .then(() => {
        console.log(`fetch tie remote ${tie_id} finished`);
      });
    // return promise;
  }

  fetchTieList(offset, limit, resolve, reject) {
    axios.get(`/api/tie`, {
        params: {'offset': offset, 'limit': limit},
        headers: {'Accept': 'application/json'},
        transformResponse: undefined
      })
      .then(res => {
        let data = res.data;
        let result = JSON.parse(data);
        let ties = result['ties'];
        resolve(result);
        this.cacheTies(ties);
      })
      .catch(res => {
        var error = 'unknown server error';
        if (res.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          var data = res.response.data;
          console.log('response', data);
          var json_resp = null;
          try {
            json_resp = JSON.parse(data);
          } catch (e) {
            // console.log(res.response);
            error = `${res.response.status} ${res.response.statusText}`;
          };
          if(json_resp) {
            error = json_resp.message || error;
          };
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', res);
          error = res.message;
        };
        console.log('set error to', error);
        return reject(error);
      })
      .then(() => {
        console.log(`fetch tie list ${offset} ${limit} finished`);
      });
    // return promise;
  }

}


const tieListCache = new TieListCache();

export default tieListCache;
